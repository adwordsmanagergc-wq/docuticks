import {
  CheckSquare,
  Type,
  Calendar,
  ChevronDown,
  PenLine,
  AlignLeft,
  User,
  Mail,
  Pencil,
} from "lucide-react";
import type { FieldType } from "@/lib/types";

export const FIELD_TYPES: {
  type: FieldType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultLabel: string;
  defaultW: number;
  defaultH: number;
}[] = [
  { type: "text", label: "Text", icon: Type, defaultLabel: "Text field", defaultW: 0.32, defaultH: 0.035 },
  { type: "multiline", label: "Multi-line", icon: AlignLeft, defaultLabel: "Notes", defaultW: 0.5, defaultH: 0.08 },
  { type: "tick", label: "Tick box", icon: CheckSquare, defaultLabel: "I agree", defaultW: 0.04, defaultH: 0.025 },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, defaultLabel: "Choose…", defaultW: 0.3, defaultH: 0.035 },
  { type: "date", label: "Date", icon: Calendar, defaultLabel: "Date", defaultW: 0.18, defaultH: 0.035 },
  { type: "signerName", label: "Signer name", icon: User, defaultLabel: "Full name", defaultW: 0.3, defaultH: 0.035 },
  { type: "signerEmail", label: "Signer email", icon: Mail, defaultLabel: "Email", defaultW: 0.3, defaultH: 0.035 },
  { type: "initials", label: "Initials", icon: Pencil, defaultLabel: "Initials", defaultW: 0.08, defaultH: 0.04 },
  { type: "signature", label: "Signature", icon: PenLine, defaultLabel: "Signature", defaultW: 0.36, defaultH: 0.08 },
];

export const FIELD_BY_TYPE = Object.fromEntries(
  FIELD_TYPES.map((f) => [f.type, f]),
) as Record<FieldType, (typeof FIELD_TYPES)[number]>;
