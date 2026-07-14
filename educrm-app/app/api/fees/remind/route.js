import { NextResponse } from "next/server";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pk = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");

// POST { items: [{ roll, name, due }] }  — files a fee reminder for each student.
// The notification is scoped to the student's roll, so it appears in that
// student's portal AND their parent's portal only.
export async function POST(req) {
  const { items } = await req.json();
  const list = Array.isArray(items) ? items : [];
  let sent = 0;
  for (const it of list) {
    if (!it?.roll) continue;
    await notify(
      it.roll,
      "Fee reminder 🔔",
      `Your school fee of ${pk(it.due)} is outstanding. Please clear the dues at your earliest convenience.`,
      "warn"
    );
    sent++;
  }
  return NextResponse.json({ ok: true, sent });
}
