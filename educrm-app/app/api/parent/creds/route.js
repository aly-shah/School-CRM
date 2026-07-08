import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const roll = new URL(req.url).searchParams.get("roll");
  const r = await q("SELECT password FROM parent_creds WHERE roll=$1", [String(roll)]);
  return NextResponse.json({ password: r.rows[0]?.password || "" });
}

export async function POST(req) {
  const { roll, password } = await req.json();
  await q("INSERT INTO parent_creds (roll,password) VALUES ($1,$2) ON CONFLICT (roll) DO UPDATE SET password=EXCLUDED.password",
    [String(roll), password]);
  return NextResponse.json({ ok: true });
}
