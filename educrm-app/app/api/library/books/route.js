import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM library_books ORDER BY title");
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const b = await req.json();
  const total = Number(b.total) || 1;
  const r = await q("INSERT INTO library_books (title,author,category,total,available) VALUES ($1,$2,$3,$4,$4) RETURNING *",
    [b.title, b.author || "—", b.category || "General", total]);
  return NextResponse.json(r.rows[0]);
}
