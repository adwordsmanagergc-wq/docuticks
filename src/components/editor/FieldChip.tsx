import type { FormField } from "@/lib/types";
import { FIELD_BY_TYPE } from "./fieldDefs";

interface Props {
  field: FormField;
  selected?: boolean;
  preview?: boolean;
  onMouseDown?: (e: React.MouseEvent) => void;
  onResizeMouseDown?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * The visual representation of a field as it appears on the editor canvas.
 * Different visual treatment per type so it reads as a real form preview.
 */
export function FieldChip({
  field,
  selected,
  preview,
  onMouseDown,
  onResizeMouseDown,
  onClick,
}: Props) {
  const def = FIELD_BY_TYPE[field.type];
  const Icon = def.icon;

  const base =
    "absolute flex items-center gap-1 overflow-hidden rounded-md border text-[10px] leading-tight transition-colors";
  const tone = selected
    ? "border-tick bg-tick/15 text-tick shadow-soft"
    : "border-tick/40 bg-tick/10 text-tick";
  const cursor = preview ? "" : "cursor-move";

  return (
    <div
      className={`${base} ${tone} ${cursor}`}
      style={{
        left: `${field.x * 100}%`,
        top: `${field.y * 100}%`,
        width: `${field.w * 100}%`,
        height: `${field.h * 100}%`,
        minHeight: 18,
        padding: "2px 4px",
      }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate font-medium">{field.label}</span>
      {field.required ? <span className="text-tick">*</span> : null}
      {!preview ? (
        <span
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-0 right-0 h-2.5 w-2.5 cursor-nwse-resize rounded-tl bg-tick"
          aria-label="Resize"
        />
      ) : null}
    </div>
  );
}
