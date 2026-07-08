import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM staff ORDER BY created_at DESC NULLS LAST, id");
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const m = await req.json();
  const r = await q("INSERT INTO staff (name,role,dept,phone,status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [m.name, m.role, m.dept, m.phone || "—", m.status || "On duty"]);
  return NextResponse.json(r.rows[0]);
}
