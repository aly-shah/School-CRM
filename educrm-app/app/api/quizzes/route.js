import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q('SELECT id,title,subject,"by",questions FROM quizzes ORDER BY created_at DESC NULLS LAST, id DESC');
  return NextResponse.json(r.rows.map((x) => ({ id: Number(x.id), title: x.title, subject: x.subject, by: x.by, questions: x.questions })));
}

export async function POST(req) {
  const z = await req.json();
  const id = z.id ?? Date.now();
  await q('INSERT INTO quizzes (id,title,subject,"by",questions) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING',
    [id, z.title, z.subject, z.by || "Teacher", JSON.stringify(z.questions || [])]);
  return NextResponse.json({ ok: true, id });
}
