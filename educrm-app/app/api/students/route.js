import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { mapStudent } from "@/lib/map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM students ORDER BY created_at DESC NULLS LAST, id");
  return NextResponse.json(r.rows.map(mapStudent));
}

export async function POST(req) {
  const s = await req.json();
  try {
    const r = await q(
      `INSERT INTO students (id,name,grade,roll,gender,status,attendance,overall,grade_letter,rank,fee_annual,fee_paid,fee_due,subjects)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [s.id, s.name, s.grade, s.roll, s.gender || "Male", s.status || "Active", s.attendance ?? 100, s.overall ?? 0,
       s.grade_letter || "—", String(s.rank ?? "—"), s.fees?.annual ?? 180000, s.fees?.paid ?? 0, s.fees?.due ?? s.feeDue ?? 180000,
       JSON.stringify(s.subjects || [])]
    );
    return NextResponse.json(mapStudent(r.rows[0]));
  } catch (e) {
    if (String(e).includes("unique") || e.code === "23505")
      return NextResponse.json({ error: `Roll number ${s.roll} already exists in class ${s.grade}.` }, { status: 409 });
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
