import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { grade, entries: [{ roll, status: 'P'|'A'|'L', name }] }
// Files a notification for each absent / on-leave student (seen by that
// student + their parent). Present students are not alerted.
export async function POST(req) {
  const { grade, entries } = await req.json();
  const list = Array.isArray(entries) ? entries : [];
  let alerted = 0;
  for (const e of list) {
    if (!e?.roll) continue;
    if (e.status === "A") {
      await notify(e.roll, "Marked absent today ❗", `You were marked absent for ${grade || "class"} today. Please contact the school office if this is unexpected.`, "bad");
      alerted++;
    } else if (e.status === "L") {
      await notify(e.roll, "Recorded on leave 📝", `You were recorded as on leave for ${grade || "class"} today.`, "warn");
      alerted++;
    }
  }
  return NextResponse.json({ ok: true, alerted });
}
