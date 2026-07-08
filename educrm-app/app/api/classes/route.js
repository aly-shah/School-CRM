import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM classes ORDER BY id");
  return NextResponse.json(r.rows.map((c) => ({ id: c.id, name: c.name, teacher: c.teacher, room: c.room, students: c.students, grid: c.grid })));
}

export async function POST(req) {
  const c = await req.json();
  try {
    const r = await q("INSERT INTO classes (id,name,teacher,room,students,grid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [c.id, c.name, c.teacher, c.room, c.students || 0, JSON.stringify(c.grid || [])]);
    const row = r.rows[0];
    return NextResponse.json({ id: row.id, name: row.name, teacher: row.teacher, room: row.room, students: row.students, grid: row.grid });
  } catch (e) {
    if (e.code === "23505") return NextResponse.json({ error: "A class with that name already exists." }, { status: 409 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
