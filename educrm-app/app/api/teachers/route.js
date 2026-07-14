import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const map = (r) => ({ id: r.id, name: r.name, username: r.username, subject: r.subject, classes: r.classes, phone: r.phone, photo: r.photo, status: r.status });

export async function GET() {
  const r = await q("SELECT * FROM teachers ORDER BY created_at DESC NULLS LAST, id");
  return NextResponse.json(r.rows.map(map)); // password never returned
}

export async function POST(req) {
  const t = await req.json();
  if (!t.name?.trim() || !t.username?.trim() || !t.password) {
    return NextResponse.json({ error: "Name, username and password are required." }, { status: 400 });
  }
  try {
    const r = await q(
      `INSERT INTO teachers (name,username,password,subject,classes,phone,photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [t.name.trim(), t.username.trim().toLowerCase(), t.password, t.subject || null, t.classes || null, t.phone || null, t.photo || null]
    );
    return NextResponse.json(map(r.rows[0]));
  } catch (e) {
    if (e.code === "23505") return NextResponse.json({ error: `Username "${t.username}" is already taken.` }, { status: 409 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
