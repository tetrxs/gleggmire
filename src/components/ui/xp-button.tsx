"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type XpButtonVariant = "default" | "primary" | "danger";

interface XpButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: XpButtonVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<XpButtonVariant, string> = {
  default: [
    "bg-[#F3F4F6] text-[var(--color-text)] hover:bg-[#E5E7EB]",
    "dark:bg-[#27272A] dark:hover:bg-[#3F3F46]",
  ].join(" "),
  primary: [
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
  ].join(" "),
  danger: [
    "bg-[var(--color-error)] text-white hover:bg-[#DC2626]",
  ].join(" "),
};

export function XpButton({
  variant = "default",
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: XpButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-lg px-4 py-2",
        "text-sm font-medium",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
