"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { signIn, signOut, auth } from "./auth";
import { DEFAULT_FILENAME_PATTERN } from "./types";

// ---------- Auth actions ---------------------------------------------------

const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
  company: z.string().trim().max(200).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type FormState = { error?: string } | null;

export async function signupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    company: formData.get("company") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, email, password, company } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, company },
  });

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in." };
    }
    throw err;
  }
  redirect("/dashboard");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Wrong email or password." };
    }
    throw err;
  }
  redirect("/dashboard");
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// ---------- Form CRUD ------------------------------------------------------

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Unauthorized");
  return id;
}

const fieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "multiline",
    "tick",
    "dropdown",
    "date",
    "signerName",
    "signerEmail",
    "signature",
    "initials",
  ]),
  page: z.number().int().positive(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  label: z.string(),
  required: z.boolean(),
  helper: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  defaultValue: z.string().optional(),
});

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

export type CreateFormResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createFormAction(
  formData: FormData,
): Promise<CreateFormResult> {
  let ownerId: string;
  try {
    ownerId = await requireUserId();
  } catch {
    return { ok: false, error: "You need to sign in again to upload a form." };
  }

  const file = formData.get("pdf");
  const name = String(formData.get("name") ?? "Untitled form");
  const pageCount = Number(formData.get("pageCount") ?? 0);
  if (!(file instanceof Blob)) {
    return { ok: false, error: "The upload was missing the PDF data." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: "PDF is too large (10 MB max)." };
  }
  if (!Number.isFinite(pageCount) || pageCount < 1) {
    return { ok: false, error: "Could not read PDF page count." };
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const created = await prisma.form.create({
      data: {
        ownerId,
        name,
        pageCount,
        fields: [] as unknown as Prisma.InputJsonValue,
        filenamePattern: DEFAULT_FILENAME_PATTERN,
        pdf: buf,
      },
      select: { id: true },
    });
    revalidatePath("/forms");
    return { ok: true, id: created.id };
  } catch (err) {
    console.error("createFormAction failed", {
      ownerId,
      name,
      pageCount,
      fileSize: file.size,
      err,
    });
    const message =
      err instanceof Error ? err.message : "Unknown database error";
    return { ok: false, error: `Could not save form: ${message}` };
  }
}

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  fields: z.array(fieldSchema).optional(),
  status: z.enum(["draft", "published"]).optional(),
  filenamePattern: z.string().min(1).optional(),
});

export async function updateFormAction(
  id: string,
  patch: z.input<typeof updateSchema>,
): Promise<void> {
  const ownerId = await requireUserId();
  const parsed = updateSchema.parse(patch);
  await prisma.form.updateMany({
    where: { id, ownerId },
    data: {
      ...(parsed.name !== undefined ? { name: parsed.name } : {}),
      ...(parsed.fields !== undefined
        ? { fields: parsed.fields as unknown as Prisma.InputJsonValue }
        : {}),
      ...(parsed.status !== undefined
        ? { status: parsed.status === "published" ? "PUBLISHED" : "DRAFT" }
        : {}),
      ...(parsed.filenamePattern !== undefined
        ? { filenamePattern: parsed.filenamePattern }
        : {}),
    },
  });
  revalidatePath(`/forms/${id}`);
  revalidatePath("/forms");
}

export async function deleteFormAction(id: string): Promise<void> {
  const ownerId = await requireUserId();
  await prisma.form.deleteMany({ where: { id, ownerId } });
  revalidatePath("/forms");
}

// ---------- Submission ------------------------------------------------------

export async function submitFormAction(
  formData: FormData,
): Promise<{ id: string; filename: string }> {
  const formId = String(formData.get("formId") ?? "");
  const signerName = String(formData.get("signerName") ?? "Signer");
  const signerEmail = String(formData.get("signerEmail") ?? "");
  const filename = String(formData.get("filename") ?? "submission.pdf");
  const valuesRaw = String(formData.get("values") ?? "{}");
  const file = formData.get("pdf");
  if (!(file instanceof Blob)) throw new Error("Missing completed PDF");
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("Completed PDF is too large.");
  }
  const form = await prisma.form.findFirst({
    where: { id: formId, status: "PUBLISHED" },
    select: { id: true, ownerId: true },
  });
  if (!form) throw new Error("Form not found or not published");

  const buf = Buffer.from(await file.arrayBuffer());
  let values: Record<string, string> = {};
  try {
    values = JSON.parse(valuesRaw);
  } catch {
    values = {};
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;
  const userAgent = h.get("user-agent") || null;

  const created = await prisma.submission.create({
    data: {
      formId: form.id,
      ownerId: form.ownerId,
      signerName,
      signerEmail: signerEmail || null,
      filename,
      values: values as unknown as Prisma.InputJsonValue,
      pdf: buf,
      ip,
      userAgent,
    },
    select: { id: true, filename: true },
  });
  revalidatePath("/submissions");
  revalidatePath("/dashboard");
  return created;
}
