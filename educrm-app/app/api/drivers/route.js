import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM drivers ORDER BY created_at DESC NULLS LAST, id");
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const d = await req.json();
  if (!d.name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const r = await q(
    `INSERT INTO drivers (name,cnic,phone,license_no,route,bus,photo,status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [d.name.trim(), d.cnic || null, d.phone || null, d.license_no || null, d.route || null, d.bus || null, d.photo || null, d.status || "Active"]
  );
  return NextResponse.json(r.rows[0]);
}
