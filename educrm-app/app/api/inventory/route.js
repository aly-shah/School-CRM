import { NextResponse } from "next/server";
import { q } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await q("SELECT * FROM inventory_items ORDER BY name");
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const i = await req.json();
  if (i.id && typeof i.delta === "number") {
    await q("UPDATE inventory_items SET quantity=GREATEST(0, quantity+$1) WHERE id=$2", [i.delta, i.id]);
    return NextResponse.json({ ok: true });
  }
  const r = await q("INSERT INTO inventory_items (name,category,quantity,unit,min_stock) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [i.name, i.category || "General", Number(i.quantity) || 0, i.unit || "pcs", Number(i.minStock) || 0]);
  return NextResponse.json(r.rows[0]);
}
