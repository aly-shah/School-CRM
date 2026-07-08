import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { mapStudent } from "@/lib/map";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const r = await q("SELECT * FROM students WHERE id=$1", [params.id]);
  if (!r.rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(mapStudent(r.rows[0]));
}

export async function PATCH(req, { params }) {
  const body = await req.json();
  if (body.photo !== undefined) {
    await q("UPDATE students SET photo=$1 WHERE id=$2", [body.photo, params.id]);
  }
  const r = await q("SELECT * FROM students WHERE id=$1", [params.id]);
  return NextResponse.json(r.rows.length ? mapStudent(r.rows[0]) : null);
}
