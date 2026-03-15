"use client";

interface OpenModalButtonProps {
  event: string;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function OpenModalButton({ event, className, children, style }: OpenModalButtonProps) {
  return (
    <button
      className={className}
      style={style}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(event));
        }
      }}
    >
      {children}
    </button>
  );
}
