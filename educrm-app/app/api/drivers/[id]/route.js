import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const body = await req.json();
  if (body.photo !== undefined) await q("UPDATE drivers SET photo=$1 WHERE id=$2", [body.photo, params.id]);
  if (body.status !== undefined) await q("UPDATE drivers SET status=$1 WHERE id=$2", [body.status, params.id]);
  const r = await q("SELECT * FROM drivers WHERE id=$1", [params.id]);
  return NextResponse.json(r.rows[0] || null);
}
