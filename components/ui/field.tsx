import type { ComponentProps } from "react";

const control =
  "w-full rounded-input border border-line bg-white px-4 text-[16px] text-ink placeholder:text-ink-3 transition-colors duration-150 hover:border-line-strong focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

export function TextField({
  label, hint, id, ...props
}: ComponentProps<"input"> & { label: string; hint?: string; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input id={id} className={`${control} min-h-12`} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] text-ink-3">
          {hint}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  label, hint, id, hideLabel = false, ...props
}: ComponentProps<"textarea"> & { label: string; hint?: string; id: string; hideLabel?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "text-sm font-semibold text-ink"}>
        {label}
      </label>
      <textarea id={id} className={`${control} min-h-32 resize-y py-3 leading-relaxed`} aria-describedby={hint ? `${id}-hint` : undefined} {...props} />
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] text-ink-3">
          {hint}
        </p>
      )}
    </div>
  );
}
