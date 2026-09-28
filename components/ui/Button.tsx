import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary: "bg-track text-white hover:bg-track/90",
  outline: "border border-line bg-surface text-ink hover:bg-paper",
};

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-none";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  disabled?: boolean;
  children: ReactNode;
};

export function LinkButton({ variant = "primary", disabled, className = "", children, ...props }: LinkButtonProps) {
  if (disabled) {
    return (
      <span className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} pointer-events-none opacity-50 ${className}`}>
        {children}
      </span>
    );
  }
  return (
    <a className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
