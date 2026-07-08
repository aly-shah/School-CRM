import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify, notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const roll = new URL(req.url).searchParams.get("roll");
  const r = roll
    ? await q("SELECT * FROM quiz_results WHERE roll=$1 ORDER BY id DESC", [roll])
    : await q("SELECT * FROM quiz_results ORDER BY id DESC");
  return NextResponse.json(r.rows.map((x) => ({ quizId: Number(x.quiz_id), roll: x.roll, title: x.title, subject: x.subject, score: x.score, total: x.total, at: x.at })));
}

export async function POST(req) {
  const r = await req.json();
  await q("INSERT INTO quiz_results (quiz_id,roll,title,subject,score,total,at) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [r.quizId, String(r.roll), r.title, r.subject, r.score, r.total, r.at]);
  await notify(r.roll, "Quiz graded 📝", `${r.title}: scored ${r.score}/${r.total}`, r.score / r.total >= 0.5 ? "good" : "warn");
  await notifyPortal("teacher", "Quiz attempted ✅", `Roll ${r.roll} scored ${r.score}/${r.total} in "${r.title}".`, "info");
  return NextResponse.json({ ok: true });
}
