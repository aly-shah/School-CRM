import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify, notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const thread = new URL(req.url).searchParams.get("thread") || "12";
  const r = await q("SELECT from_role, body, at FROM messages WHERE thread=$1 ORDER BY id", [thread]);
  return NextResponse.json(r.rows.map((x) => ({ from: x.from_role, text: x.body, at: x.at })));
}

export async function POST(req) {
  const m = await req.json();
  const thread = m.thread || "12";
  await q("INSERT INTO messages (thread,from_role,body,at) VALUES ($1,$2,$3,$4)",
    [thread, m.from, m.text, m.at]);

  // ping the recipient's notification bell
  const preview = m.text?.length > 70 ? m.text.slice(0, 68) + "…" : m.text;
  if (m.from === "teacher") {
    // thread is the student's roll → seen by that student + their parent
    await notify(thread, "New message 💬", `Class teacher: “${preview}”`, "info");
  } else {
    await notifyPortal("teacher", "New message 💬", `A parent sent a message: “${preview}”`, "info");
  }
  return NextResponse.json({ ok: true });
}
