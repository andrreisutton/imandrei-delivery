"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { CaretDown, Check } from "@phosphor-icons/react";

export type SelectItem = { value: string; label: string };

export function Select({
  items,
  placeholder,
  name,
  id,
  required,
  value,
  defaultValue,
  onValueChange,
  ariaLabel,
}: {
  items: SelectItem[];
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  ariaLabel?: string;
}) {
  return (
    <RadixSelect.Root
      name={name}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <RadixSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className="input group flex items-center justify-between gap-3 text-left data-[placeholder]:text-faint"
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <CaretDown
            size={14}
            weight="bold"
            className="shrink-0 text-faint transition-transform duration-200 [transition-timing-function:var(--ease-out-quint)] group-data-[state=open]:rotate-180"
          />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 w-[var(--radix-select-trigger-width)] origin-[var(--radix-select-content-transform-origin)] overflow-hidden rounded-[8px] border border-line-strong bg-raised/95 p-1 shadow-[inset_0_1px_0_oklch(1_0_0_/_8%),0_16px_40px_-8px_oklch(0_0_0_/_70%)] backdrop-blur-xl data-[state=closed]:animate-select-out data-[state=open]:animate-select-in"
        >
          <RadixSelect.Viewport className="max-h-72">
            {items.map((item) => (
              <RadixSelect.Item
                key={item.value}
                value={item.value}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-sm text-muted outline-none transition-colors duration-100 data-[highlighted]:bg-accent-dim data-[highlighted]:text-ink data-[state=checked]:text-ink"
              >
                <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check size={13} weight="bold" className="text-accent-bright" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
