"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type XpButtonVariant = "default" | "primary" | "danger";

interface XpButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: XpButtonVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<XpButtonVariant, string> = {
  default: "",
  primary: "xp-button-primary",
  danger: "xp-button-danger",
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
      className={`xp-button ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
