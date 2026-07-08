import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function map(r) {
  return {
    id: r.id, title: r.title, subject: r.subject, cls: r.cls, due: r.due, desc: r.descr, status: r.status,
    attach: r.attach_data ? { name: r.attach_name, type: r.attach_type, data: r.attach_data } : null,
    subs: r.subs || [],
  };
}

export async function GET() {
  const r = await q(
    `SELECT h.*, coalesce(array_agg(s.roll) FILTER (WHERE s.roll IS NOT NULL), '{}') AS subs
     FROM homework h LEFT JOIN homework_submissions s ON s.homework_id = h.id
     GROUP BY h.id ORDER BY h.created_at DESC NULLS LAST, h.id`
  );
  return NextResponse.json(r.rows.map(map));
}

export async function POST(req) {
  const h = await req.json();
  const id = String(h.id ?? Date.now());
  await q(
    `INSERT INTO homework (id,title,subject,cls,due,descr,attach_name,attach_type,attach_data,status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id, h.title, h.subject, h.cls || "6-B", h.due || "This week", h.desc || null,
     h.attach?.name || null, h.attach?.type || null, h.attach?.data || null, h.status || "Open"]
  );
  await notify("12", "New homework 📘", `${h.title} — ${h.subject}, due ${h.due || "soon"}`, "info");
  return NextResponse.json({ ok: true, id });
}
