import { PageHeader, StatTile, Card, Donut } from "@/components/ui";
import { I } from "@/components/icons";
import { feeMonths } from "@/lib/data";

const gradeDist = [
  { g: "A+ / A", pct: 38, c: "var(--good)" },
  { g: "B+ / B", pct: 34, c: "var(--info)" },
  { g: "C+ / C", pct: 21, c: "var(--warn)" },
  { g: "Below C", pct: 7, c: "var(--bad)" },
];

export default function ReportsOverview({ title = "Reports & Analytics", subtitle = "One-click insights across the whole school" }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export PDF</button>
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export Excel</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Enrolment" icon={I.students} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="1,284" sub="+1.4% MoM" />
        <StatTile label="Avg. attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="94%" sub="term to date" />
        <StatTile label="Fee realisation" icon={I.fees} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="88%" sub="of billed" />
        <StatTile label="Pass rate" icon={I.exams} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="93%" sub="Term 2" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <Card title="Fee collection · 6 months">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
            {feeMonths.map((m) => (
              <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span className="tnum" style={{ fontSize: 11, color: "var(--muted)" }}>{m.pct}%</span>
                <div style={{ width: "100%", height: `${m.pct}%`, borderRadius: "6px 6px 3px 3px", background: m.pct >= 90 ? "var(--good)" : "var(--accent)", opacity: 0.9 }} />
                <small style={{ fontSize: 11, color: "var(--muted)" }}>{m.m}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Grade distribution">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gradeDist.map((g) => (
              <div key={g.g} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 72, fontSize: 12.5, color: "var(--ink-soft)" }}>{g.g}</span>
                <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${g.pct}%`, background: g.c }} /></div>
                <span className="tnum" style={{ width: 34, textAlign: "right", fontWeight: 700, fontSize: 13 }}>{g.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid g-3">
        <Card title="Attendance"><div style={{ display: "grid", placeItems: "center", padding: "6px 0" }}><Donut pct={94} color="var(--good)" label="Present" /></div></Card>
        <Card title="Fees realised"><div style={{ display: "grid", placeItems: "center", padding: "6px 0" }}><Donut pct={88} label="Collected" /></div></Card>
        <Card title="Staff on duty"><div style={{ display: "grid", placeItems: "center", padding: "6px 0" }}><Donut pct={94} color="var(--info)" label="Present" /></div></Card>
      </div>
    </>
  );
}
