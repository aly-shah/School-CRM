import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const { id, roll } = await req.json();
  await q("INSERT INTO homework_submissions (homework_id, roll) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [String(id), String(roll)]);

  // find the homework + who assigned it, and the student's name
  const hw = (await q("SELECT title, cls, teacher_id FROM homework WHERE id=$1", [String(id)])).rows[0] || {};
  const stu = (await q("SELECT name FROM students WHERE roll=$1 AND grade=$2 LIMIT 1", [String(roll), hw.cls || ""])).rows[0];
  const who = stu?.name || `Roll ${roll}`;
  const title = hw.title ? `“${hw.title}”` : "an assignment";

  // notify the assigning teacher personally; fall back to the whole teacher desk
  const audience = hw.teacher_id ? `teacher:${hw.teacher_id}` : "teacher";
  await notifyPortal(audience, "Homework submitted 📥", `${who} submitted ${title}.`, "info");

  return NextResponse.json({ ok: true });
}
