"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  renderOptionActions?: (option: DropdownOption) => React.ReactNode;
  "aria-label"?: string;
};

export function Dropdown({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled,
  className,
  renderOptionActions,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const listboxId = React.useId();

  React.useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          "h-9 w-full rounded-full border border-border bg-background px-3 text-sm flex items-center justify-between gap-2 text-left",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-popover shadow-md p-1"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            const optionActions = renderOptionActions?.(option);
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-sm flex items-center justify-between text-left",
                  "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  isSelected && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(option.value);
                    setOpen(false);
                  }
                }}
              >
                <span className="min-w-0 truncate flex-1">{option.label}</span>
                <span className="flex items-center gap-1 shrink-0">
                  {isSelected ? <Check className="h-4 w-4" /> : null}
                  {optionActions}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
