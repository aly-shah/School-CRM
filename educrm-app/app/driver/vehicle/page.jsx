"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatTile, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { getDrivers, getVehicleCheck, submitVehicleCheck } from "@/lib/store";

const DEFAULT_ITEMS = [
  "Tyres & brakes", "Engine oil & coolant", "Lights & indicators", "Fuel level",
  "First-aid kit", "Fire extinguisher", "Seat belts", "GPS device",
  "Emergency exit", "Wipers & mirrors",
];

export default function Vehicle() {
  const [driver, setDriver] = useState(null);
  const [items, setItems] = useState(DEFAULT_ITEMS.map((i) => ({ item: i, ok: true })));
  const [note, setNote] = useState("");
  const [last, setLast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    getDrivers().then((ds) => {
      const d = ds.find((x) => x.name === "Rashid Mehmood") || ds[0] || null;
      setDriver(d);
      if (d?.bus) getVehicleCheck(d.bus).then((c) => {
        if (c) { setLast(c); if (c.items?.length) setItems(c.items); if (c.note) setNote(c.note); }
      });
    });
  }, []);

  const toggle = (i, ok) => { setItems((arr) => arr.map((x, j) => (j === i ? { ...x, ok } : x))); setSavedAt(null); };

  const okCount = items.filter((x) => x.ok).length;
  const status = okCount === items.length ? "Pass" : "Attention";

  const submit = async () => {
    setSaving(true);
    const c = await submitVehicleCheck({ bus: driver?.bus || "—", driver: driver?.name || "Driver", items, note });
    setLast(c); setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })); setSaving(false);
  };

  const fmt = (t) => (t ? new Date(t).toLocaleString() : "—");

  return (
    <>
      <PageHeader title="Vehicle checklist" subtitle={`Bus ${driver?.bus || "—"} · daily pre-trip inspection`}>
        <button className="btn primary" onClick={submit} disabled={saving}>{I.check}{saving ? "Saving…" : "Submit checklist"}</button>
      </PageHeader>

      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{ width: 50, height: 50, borderRadius: 14, flex: "0 0 auto", display: "grid", placeItems: "center", background: status === "Pass" ? "var(--good-bg)" : "var(--warn-bg)", color: status === "Pass" ? "var(--good)" : "var(--warn)" }}>
            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24 }}>{status === "Pass" ? I.check : I.bell}</span>
          </span>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{status === "Pass" ? "All checks passing" : `${items.length - okCount} item(s) need attention`}</div>
            <div className="soft" style={{ fontSize: 12.5 }}>{savedAt ? `Submitted at ${savedAt} — visible to admin` : last ? `Last submitted ${fmt(last.at)}` : "Not submitted yet today"}</div>
          </div>
          <Pill kind={status === "Pass" ? "good" : "warn"} dot>{okCount}/{items.length} OK</Pill>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Fuel" icon={I.fuel} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="82%" sub="~340 km range" />
        <StatTile label="Odometer" icon={I.route} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="84,210" sub="km" />
        <StatTile label="Next service" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="1,790" sub="km remaining" />
        <StatTile label="Fitness" icon={I.check} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="Valid" sub="till Mar 2026" />
      </div>

      <Card title="Pre-trip safety checklist" pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ paddingBottom: 6 }}>
          <div className="list">
            {items.map((c, i) => (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: c.ok ? "var(--good-bg)" : "var(--warn-bg)", color: c.ok ? "var(--good)" : "var(--warn)" }}>
                  <span style={{ display: "grid", placeItems: "center" }}>{c.ok ? I.check : I.bell}</span>
                </span>
                <div className="l-main"><div className="l-t">{c.item}</div></div>
                <div className="l-end" style={{ display: "inline-flex", gap: 6 }}>
                  <button onClick={() => toggle(i, true)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: c.ok ? "var(--good)" : "var(--panel)", color: c.ok ? "#fff" : "var(--ink-soft)" }}>OK</button>
                  <button onClick={() => toggle(i, false)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: !c.ok ? "var(--warn)" : "var(--panel)", color: !c.ok ? "#fff" : "var(--ink-soft)" }}>Issue</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Notes for the workshop / admin">
        <textarea value={note} onChange={(e) => { setNote(e.target.value); setSavedAt(null); }} rows={3} placeholder="Anything the office should know (e.g. brake noise, low washer fluid)…"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", boxSizing: "border-box", resize: "vertical" }} />
        <button className="btn primary" onClick={submit} disabled={saving} style={{ marginTop: 12 }}>{I.check}{saving ? "Saving…" : "Submit checklist"}</button>
      </Card>
    </>
  );
}
