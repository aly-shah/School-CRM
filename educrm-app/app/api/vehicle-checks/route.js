import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { notifyPortal } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const map = (r) => ({ id: r.id, bus: r.bus, driver: r.driver, items: r.items || [], note: r.note, status: r.status, at: r.submitted_at });

export async function GET(req) {
  const bus = new URL(req.url).searchParams.get("bus");
  if (bus) {
    const r = await q("SELECT * FROM vehicle_checks WHERE bus=$1 ORDER BY id DESC LIMIT 1", [bus]);
    return NextResponse.json(r.rows.length ? map(r.rows[0]) : null);
  }
  // latest per bus (for the admin overview)
  const r = await q("SELECT DISTINCT ON (bus) * FROM vehicle_checks ORDER BY bus, id DESC");
  return NextResponse.json(r.rows.map(map));
}

export async function POST(req) {
  const c = await req.json();
  const items = Array.isArray(c.items) ? c.items : [];
  const status = items.every((i) => i.ok) ? "Pass" : "Attention";
  const r = await q(
    "INSERT INTO vehicle_checks (bus, driver, items, note, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [c.bus || null, c.driver || null, JSON.stringify(items), c.note || null, status]
  );
  if (status === "Attention") {
    const failed = items.filter((i) => !i.ok).map((i) => i.item).join(", ");
    await notifyPortal("admin", "Vehicle needs attention 🛠️", `Bus ${c.bus || "—"} (${c.driver || "driver"}): ${failed}`, "bad");
  }
  return NextResponse.json(map(r.rows[0]));
}
