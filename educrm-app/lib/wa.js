// WhatsApp click-to-chat helpers.
// Numbers are stored like "+92 300 8412345" or "0300 8412345"; normalise to
// the international digits wa.me expects (e.g. 923008412345).
export function waNumber(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0")) d = "92" + d.slice(1);       // 03008412345 -> 923008412345
  else if (d.length === 10) d = "92" + d;             // 3008412345  -> 923008412345
  return d;
}

export function waLink(raw, text) {
  const n = waNumber(raw);
  if (!n) return null;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// Open the chat in a new tab (works on web + inside the Android WebView).
export function openWhatsApp(raw, text) {
  const url = waLink(raw, text);
  if (!url) return false;
  if (typeof window !== "undefined") window.open(url, "_blank");
  return true;
}
