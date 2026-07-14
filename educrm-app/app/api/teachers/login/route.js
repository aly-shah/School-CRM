import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { username, password } = await req.json();
  const r = await q("SELECT * FROM teachers WHERE username=$1", [String(username || "").trim().toLowerCase()]);
  const t = r.rows[0];
  if (!t || t.password !== password) return NextResponse.json({ ok: false });
  return NextResponse.json({ ok: true, teacher: { id: t.id, name: t.name, username: t.username, subject: t.subject, classes: t.classes, photo: t.photo } });
}
