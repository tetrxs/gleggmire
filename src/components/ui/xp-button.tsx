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
    "border-2 border-[var(--color-text)] bg-transparent text-[var(--color-text)]",
    "hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]",
  ].join(" "),
  primary: [
    "border-2 border-[var(--color-accent)] bg-[var(--color-accent)] text-white",
    "hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]",
  ].join(" "),
  danger: [
    "border-2 border-[var(--color-error)] bg-[var(--color-error)] text-white",
    "hover:bg-red-700 hover:border-red-700",
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
        "rounded-full px-6 py-2.5",
        "text-sm font-semibold uppercase tracking-wider",
        "transition-all duration-200 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
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
