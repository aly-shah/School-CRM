import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function map(rows) {
  return rows.map((n) => ({ id: n.id, roll: n.roll, title: n.title, body: n.body, kind: n.kind, read: n.read, at: n.created_at }));
}

// A teacher sees broadcast desk notes (audience 'teacher') AND their personal
// ones (audience 'teacher:<id>'), passed as tid.
function audiences(audience, tid) {
  const a = [audience];
  if (audience === "teacher" && tid) a.push(`teacher:${tid}`);
  return a;
}

export async function GET(req) {
  const url = new URL(req.url);
  const roll = url.searchParams.get("roll");
  const audience = url.searchParams.get("audience");
  const tid = url.searchParams.get("tid");
  let rows = [];
  if (roll) rows = (await q("SELECT * FROM notifications WHERE roll=$1 ORDER BY id DESC LIMIT 30", [String(roll)])).rows;
  else if (audience) rows = (await q("SELECT * FROM notifications WHERE audience = ANY($1) ORDER BY id DESC LIMIT 30", [audiences(audience, tid)])).rows;
  return NextResponse.json(map(rows));
}

export async function PATCH(req) {
  const { roll, audience, tid } = await req.json();
  if (roll) await q("UPDATE notifications SET read=true WHERE roll=$1", [String(roll)]);
  else if (audience) await q("UPDATE notifications SET read=true WHERE audience = ANY($1)", [audiences(audience, tid)]);
  return NextResponse.json({ ok: true });
}
