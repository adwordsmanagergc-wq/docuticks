import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Owner-only download of the completed PDF. */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const sub = await prisma.submission.findFirst({
    where: { id, ownerId: session.user.id },
    select: { pdf: true, filename: true },
  });
  if (!sub) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(sub.pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${sub.filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
