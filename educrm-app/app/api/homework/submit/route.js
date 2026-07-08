import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { id, roll } = await req.json();
  await q("INSERT INTO homework_submissions (homework_id, roll) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [String(id), String(roll)]);
  await notifyPortal("teacher", "Homework submitted 📥", `A student (roll ${roll}) submitted an assignment.`, "info");
  return NextResponse.json({ ok: true });
}
