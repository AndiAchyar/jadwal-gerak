import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "track" | "start" | "urgent" | "outline";

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "bg-ink text-white",
  track: "bg-track text-white",
  start: "bg-start text-ink",
  urgent: "bg-urgent text-white",
  outline: "border border-line bg-surface text-muted",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
