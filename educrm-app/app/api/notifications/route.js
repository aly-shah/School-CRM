import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function map(rows) {
  return rows.map((n) => ({ id: n.id, roll: n.roll, title: n.title, body: n.body, kind: n.kind, read: n.read, at: n.created_at }));
}

export async function GET(req) {
  const url = new URL(req.url);
  const roll = url.searchParams.get("roll");
  const audience = url.searchParams.get("audience");
  let rows = [];
  if (roll) rows = (await q("SELECT * FROM notifications WHERE roll=$1 ORDER BY id DESC LIMIT 30", [String(roll)])).rows;
  else if (audience) rows = (await q("SELECT * FROM notifications WHERE audience=$1 ORDER BY id DESC LIMIT 30", [audience])).rows;
  return NextResponse.json(map(rows));
}

export async function PATCH(req) {
  const { roll, audience } = await req.json();
  if (roll) await q("UPDATE notifications SET read=true WHERE roll=$1", [String(roll)]);
  else if (audience) await q("UPDATE notifications SET read=true WHERE audience=$1", [audience]);
  return NextResponse.json({ ok: true });
}
