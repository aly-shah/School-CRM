import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM library_loans WHERE returned=false ORDER BY id DESC");
  return NextResponse.json(r.rows);
}

// issue a book
export async function POST(req) {
  const l = await req.json();
  const upd = await q("UPDATE library_books SET available=available-1 WHERE id=$1 AND available>0 RETURNING title", [l.bookId]);
  if (!upd.rows.length) return NextResponse.json({ error: "No copies available." }, { status: 409 });
  const title = upd.rows[0].title;
  const r = await q("INSERT INTO library_loans (book_id,book_title,student,roll,issued,due) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [l.bookId, title, l.student, String(l.roll || ""), l.issued, l.due]);
  await notify(l.roll, "Book issued 📚", `${title} — return by ${l.due}`, "info");
  return NextResponse.json(r.rows[0]);
}

// return a book
export async function PATCH(req) {
  const { id } = await req.json();
  const r = await q("UPDATE library_loans SET returned=true WHERE id=$1 RETURNING book_id, book_title, roll", [id]);
  if (r.rows.length) {
    await q("UPDATE library_books SET available=available+1 WHERE id=$1", [r.rows[0].book_id]);
    await notify(r.rows[0].roll, "Book returned ✅", `${r.rows[0].book_title} returned. Thank you!`, "good");
  }
  return NextResponse.json({ ok: true });
}
