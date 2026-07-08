import { PageHeader, StatTile, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { routes } from "@/lib/data";

const checks = [
  { item: "Tyres & brakes", ok: true },
  { item: "Fuel level", ok: true },
  { item: "First-aid kit", ok: true },
  { item: "Fire extinguisher", ok: true },
  { item: "GPS device", ok: true },
  { item: "Emergency exit", ok: false },
];

export default function Vehicle() {
  const r = routes[0];
  return (
    <>
      <PageHeader title="Vehicle" subtitle={`Bus ${r.bus} · daily log`}>
        <button className="btn primary"><span style={{ display: "flex" }}>{I.check}</span>Submit checklist</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Fuel" icon={I.fuel} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="82%" sub="~340 km range" />
        <StatTile label="Odometer" tint={{}} value="84,210" sub="km" />
        <StatTile label="Next service" tint={{}} value="1,790" sub="km remaining" />
        <StatTile label="Fitness" tint={{}} value="Valid" sub="till Mar 2026" />
      </div>

      <Card title="Pre-trip safety checklist">
        <div className="list">
          {checks.map((c, i) => (
            <div key={i} className="list-row">
              <span className="l-ic" style={{ background: c.ok ? "var(--good-bg)" : "var(--warn-bg)", color: c.ok ? "var(--good)" : "var(--warn)" }}>
                <span style={{ display: "grid", placeItems: "center" }}>{c.ok ? I.check : I.bell}</span>
              </span>
              <div className="l-main"><div className="l-t">{c.item}</div></div>
              <div className="l-end"><Pill kind={c.ok ? "good" : "warn"} dot>{c.ok ? "OK" : "Check"}</Pill></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
