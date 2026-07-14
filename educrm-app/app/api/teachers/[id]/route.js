import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const b = await req.json();
  if (b.photo !== undefined) await q("UPDATE teachers SET photo=$1 WHERE id=$2", [b.photo, params.id]);
  if (b.password) await q("UPDATE teachers SET password=$1 WHERE id=$2", [b.password, params.id]);
  if (b.status !== undefined) await q("UPDATE teachers SET status=$1 WHERE id=$2", [b.status, params.id]);
  const r = await q("SELECT id,name,username,subject,classes,phone,photo,status FROM teachers WHERE id=$1", [params.id]);
  return NextResponse.json(r.rows[0] || null);
}
