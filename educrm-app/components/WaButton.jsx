"use client";
import { waLink } from "@/lib/wa";

const WaIcon = (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15h-.003a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
  </svg>
);

// A one-click WhatsApp button. Opens wa.me with a pre-filled message to `phone`.
// `onSent` fires after the chat opens (use it to also log an in-app reminder).
export default function WaButton({ phone, text, label = "WhatsApp", onSent, style }) {
  const href = waLink(phone, text);
  if (!href) {
    return (
      <button className="btn" disabled title="No guardian phone on file" style={{ padding: "6px 11px", opacity: 0.5, ...style }}>
        {WaIcon}{label}
      </button>
    );
  }
  return (
    <a className="btn wa-btn" href={href} target="_blank" rel="noopener noreferrer" onClick={() => onSent && onSent()} style={{ padding: "6px 11px", ...style }}>
      {WaIcon}{label}
    </a>
  );
}
