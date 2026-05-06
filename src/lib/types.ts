/**
 * Field schema. Coordinates are stored as fractions (0-1) of the page width
 * and height so they survive zoom and re-render at any scale.
 */
export type FieldType =
  | "text"
  | "multiline"
  | "tick"
  | "dropdown"
  | "date"
  | "signerName"
  | "signerEmail"
  | "signature"
  | "initials";

export interface FormField {
  id: string;
  type: FieldType;
  page: number; // 1-based
  x: number; // 0..1 fraction of page width (top-left)
  y: number; // 0..1 fraction of page height (top-left)
  w: number; // 0..1 fraction of page width
  h: number; // 0..1 fraction of page height
  label: string;
  required: boolean;
  helper?: string;
  placeholder?: string;
  options?: string[]; // dropdown
  defaultValue?: string;
}

export interface FormDoc {
  id: string;
  name: string;
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
  pdfDataUrl: string; // raw uploaded PDF
  pageCount: number;
  fields: FormField[];
  filenamePattern: string; // {FormName}_{SignerFirstName}-{SignerLastName}_{YYYY-MM-DD}.pdf
}

export interface SubmissionDoc {
  id: string;
  formId: string;
  formName: string;
  signerName: string;
  signerEmail: string;
  submittedAt: number;
  filename: string;
  pdfDataUrl: string;
  values: Record<string, string>;
}

export const DEFAULT_FILENAME_PATTERN =
  "{FormName}_{SignerFirstName}-{SignerLastName}_{YYYY-MM-DD}.pdf";
