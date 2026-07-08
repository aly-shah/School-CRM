import { q } from "@/lib/db";

// Notify a specific student (seen by that student's portal + their parent's portal).
export async function notify(roll, title, body, kind = "info") {
  if (!roll) return;
  try {
    await q("INSERT INTO notifications (roll,title,body,kind) VALUES ($1,$2,$3,$4)", [String(roll), title, body, kind]);
  } catch { /* best-effort */ }
}

// Notify a staff portal (e.g. 'teacher','finance','admin') — seen only in that portal.
export async function notifyPortal(audience, title, body, kind = "info") {
  if (!audience) return;
  try {
    await q("INSERT INTO notifications (audience,title,body,kind) VALUES ($1,$2,$3,$4)", [audience, title, body, kind]);
  } catch { /* best-effort */ }
}
