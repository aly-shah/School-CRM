import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { roll, password } = await req.json();
  const r = await q("SELECT password FROM parent_creds WHERE roll=$1", [String(roll).trim()]);
  const ok = r.rows.length > 0 && r.rows[0].password === password;
  return NextResponse.json({ ok });
}
