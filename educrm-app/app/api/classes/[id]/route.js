import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  const body = await req.json();
  if (body.grid !== undefined) await q("UPDATE classes SET grid=$1 WHERE id=$2", [JSON.stringify(body.grid), params.id]);
  return NextResponse.json({ ok: true });
}
