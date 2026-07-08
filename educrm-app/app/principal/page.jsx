import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Donut } from "@/components/ui";
import { I } from "@/components/icons";
import { funnel, approvals } from "@/lib/data";

export default function PrincipalOverview() {
  const maxF = funnel[0].value;
  return (
    <>
      <PageHeader title="School overview" subtitle="Springdale International School · a leadership snapshot">
        <Link href="/principal/approvals" className="btn primary"><span style={{ display: "flex" }}>{I.approve}</span>{approvals.length} approvals</Link>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Enrolment" icon={I.students} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="1,284" sub="+18 this term" />
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="94%" sub="today" />
        <StatTile label="Fee realisation" icon={I.wallet} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="88%" sub="Rs 4.68 Cr collected" />
        <StatTile label="Pass rate" icon={I.exams} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="93%" sub="Term 2" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <Card title="Pending approvals" link="Review all">
          <div className="list">
            {approvals.map((a, i) => (
              <div key={i} className="list-row">
                <div className="l-main"><div className="l-t">{a.kind}</div><div className="l-s">{a.detail}</div></div>
                <div className="l-end" style={{ display: "flex", gap: 6 }}>
                  <button className="btn primary" style={{ padding: "6px 12px" }}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Admissions pipeline" link="Details">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {funnel.map((f) => (
              <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 92, fontSize: 12.5, color: "var(--ink-soft)" }}>{f.stage}</span>
                <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${(f.value / maxF) * 100}%` }} /></div>
                <span className="tnum" style={{ width: 34, textAlign: "right", fontWeight: 700, fontSize: 13 }}>{f.value}</span>
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
