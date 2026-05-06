import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Streams the original PDF for a form.
 * - If the form is PUBLISHED, anyone with the link can fetch it (this is what
 *   the signer page uses).
 * - Otherwise, only the owner can fetch it (editor / share preview).
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const form = await prisma.form.findUnique({
    where: { id },
    select: { id: true, ownerId: true, status: true, pdf: true },
  });
  if (!form) return new NextResponse("Not found", { status: 404 });

  if (form.status !== "PUBLISHED") {
    const session = await auth();
    if (session?.user?.id !== form.ownerId) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse(new Uint8Array(form.pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
