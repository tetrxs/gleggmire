"use client";

import { type ReactNode } from "react";

interface XpWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function XpWindow({ title, children, className = "" }: XpWindowProps) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      {/* Title Bar */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <h3 className="text-lg font-semibold tracking-tight">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}
