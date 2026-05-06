import "server-only";
import { auth } from "./auth";
import { prisma } from "./db";
import type { FormDoc, FormField, SubmissionDoc } from "./types";

interface FormRow {
  id: string;
  name: string;
  status: "DRAFT" | "PUBLISHED";
  pageCount: number;
  fields: unknown;
  filenamePattern: string;
  createdAt: Date;
  updatedAt: Date;
}

function toDoc(f: FormRow): FormDoc {
  return {
    id: f.id,
    name: f.name,
    status: f.status === "PUBLISHED" ? "published" : "draft",
    pageCount: f.pageCount,
    fields: (f.fields as FormField[]) ?? [],
    filenamePattern: f.filenamePattern,
    createdAt: f.createdAt.getTime(),
    updatedAt: f.updatedAt.getTime(),
    pdfUrl: `/api/forms/${f.id}/pdf`,
  };
}

export async function getMyUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getMyForms(): Promise<FormDoc[]> {
  const uid = await getMyUserId();
  if (!uid) return [];
  const rows = await prisma.form.findMany({
    where: { ownerId: uid },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      pageCount: true,
      fields: true,
      filenamePattern: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return rows.map(toDoc);
}

export async function getMyForm(id: string): Promise<FormDoc | null> {
  const uid = await getMyUserId();
  if (!uid) return null;
  const row = await prisma.form.findFirst({
    where: { id, ownerId: uid },
    select: {
      id: true,
      name: true,
      status: true,
      pageCount: true,
      fields: true,
      filenamePattern: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return row ? toDoc(row) : null;
}

/** Public read for the signer page — only when the form is published. */
export async function getPublicForm(id: string): Promise<FormDoc | null> {
  const row = await prisma.form.findFirst({
    where: { id, status: "PUBLISHED" },
    select: {
      id: true,
      name: true,
      status: true,
      pageCount: true,
      fields: true,
      filenamePattern: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return row ? toDoc(row) : null;
}

export async function getMySubmissions(): Promise<SubmissionDoc[]> {
  const uid = await getMyUserId();
  if (!uid) return [];
  const rows = await prisma.submission.findMany({
    where: { ownerId: uid },
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      formId: true,
      filename: true,
      signerName: true,
      signerEmail: true,
      submittedAt: true,
      form: { select: { name: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    formId: r.formId,
    formName: r.form.name,
    signerName: r.signerName,
    signerEmail: r.signerEmail ?? "",
    submittedAt: r.submittedAt.getTime(),
    filename: r.filename,
  }));
}
