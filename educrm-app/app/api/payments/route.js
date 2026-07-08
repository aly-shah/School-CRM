import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notify, notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const roll = new URL(req.url).searchParams.get("roll");
  const r = await q("SELECT * FROM payments WHERE roll=$1", [String(roll)]);
  if (!r.rows.length) return NextResponse.json(null);
  const p = r.rows[0];
  return NextResponse.json({ amount: p.amount, date: p.paid_date, txn: p.txn, method: p.method });
}

export async function POST(req) {
  const p = await req.json();
  await q(`INSERT INTO payments (roll,amount,paid_date,txn,method) VALUES ($1,$2,$3,$4,$5)
           ON CONFLICT (roll) DO UPDATE SET amount=EXCLUDED.amount, paid_date=EXCLUDED.paid_date, txn=EXCLUDED.txn, method=EXCLUDED.method`,
    [String(p.roll), p.amount, p.date, p.txn, p.method]);
  await notify(p.roll, "Fee payment received ✅", `Rs ${Number(p.amount).toLocaleString("en-PK")} paid · ${p.txn}`, "good");
  await notifyPortal("finance", "Fee payment received 💰", `Roll ${p.roll} paid Rs ${Number(p.amount).toLocaleString("en-PK")} · ${p.txn}`, "good");
  return NextResponse.json({ ok: true });
}
