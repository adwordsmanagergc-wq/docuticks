export function safeSegment(s: string): string {
  return s
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-");
}

export function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] || "Signer", last: "" };
  return { first: parts[0], last: parts.slice(1).join("-") };
}

export function formatFilename(
  pattern: string,
  vars: { formName: string; signerName: string; date?: Date },
): string {
  const date = vars.date ?? new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const { first, last } = splitName(vars.signerName || "Signer");
  return pattern
    .replaceAll("{FormName}", safeSegment(vars.formName))
    .replaceAll("{SignerName}", safeSegment(vars.signerName || "Signer"))
    .replaceAll("{SignerFirstName}", safeSegment(first))
    .replaceAll("{SignerLastName}", safeSegment(last))
    .replaceAll("{YYYY-MM-DD}", `${yyyy}-${mm}-${dd}`)
    .replaceAll("{YYYY}", String(yyyy))
    .replaceAll("{MM}", mm)
    .replaceAll("{DD}", dd);
}
