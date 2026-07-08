import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const roll = new URL(req.url).searchParams.get("roll");
  const r = roll
    ? await q("SELECT * FROM certificates WHERE roll=$1 ORDER BY id DESC", [String(roll)])
    : await q("SELECT * FROM certificates ORDER BY id DESC");
  return NextResponse.json(r.rows.map((c) => ({ id: c.id, roll: c.roll, student: c.student, title: c.title, type: c.type, desc: c.descr, issuedBy: c.issued_by, date: c.issued_date })));
}

export async function POST(req) {
  const c = await req.json();
  const r = await q("INSERT INTO certificates (roll,student,title,type,descr,issued_by,issued_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
    [String(c.roll), c.student, c.title, c.type, c.desc || null, c.issuedBy || "Class Teacher", c.date]);
  await notify(c.roll, "Certificate awarded 🏅", `${c.type}: ${c.title}`, "good");
  return NextResponse.json({ ok: true, id: r.rows[0].id });
}
