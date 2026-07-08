import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const thread = new URL(req.url).searchParams.get("thread") || "12";
  const r = await q("SELECT from_role, body, at FROM messages WHERE thread=$1 ORDER BY id", [thread]);
  return NextResponse.json(r.rows.map((x) => ({ from: x.from_role, text: x.body, at: x.at })));
}

export async function POST(req) {
  const m = await req.json();
  await q("INSERT INTO messages (thread,from_role,body,at) VALUES ($1,$2,$3,$4)",
    [m.thread || "12", m.from, m.text, m.at]);
  return NextResponse.json({ ok: true });
}
