import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { funnel, feeMonths, admissions, defaulters, pkr } from "@/lib/data";

export default function DashboardAdmin({ base = "/admin" }) {
  const maxF = funnel[0].value;
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Springdale International School · Session 2025–26">
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export</button>
        <Link href={`${base}/admissions`} className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>New admission</Link>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Total students" icon={I.students} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="1,284" sub="+18 this term" />
        <StatTile label="Fees collected" icon={I.fees} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="88%" sub="Rs 4.68 Cr of Rs 5.32 Cr" />
        <StatTile label="Attendance today" icon={I.check} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="94%" sub="1,207 present" />
        <StatTile label="Open admissions" icon={I.admissions} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="48" sub="offers pending" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <Card title="Admissions funnel" link="View all">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {funnel.map((f) => (
              <div key={f.stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 92, fontSize: 12.5, color: "var(--ink-soft)" }}>{f.stage}</span>
                <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${(f.value / maxF) * 100}%` }} /></div>
                <span className="tnum" style={{ width: 34, textAlign: "right", fontWeight: 700, fontSize: 13 }}>{f.value}</span>
              </div>
            ))}
          </div>
          <div className="sep" />
          <div className="soft" style={{ fontSize: 12.5 }}>Automated follow-ups recover 10–20% of leads that would otherwise go cold.</div>
        </Card>

        <Card title="Fee collection" link="Fees">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 150 }}>
            {feeMonths.map((m) => (
              <div key={m.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span className="tnum" style={{ fontSize: 11, color: "var(--muted)" }}>{m.pct}%</span>
                <div style={{ width: "100%", height: `${m.pct}%`, borderRadius: "6px 6px 3px 3px", background: m.pct >= 90 ? "var(--good)" : "var(--accent)", opacity: 0.9 }} />
                <small style={{ fontSize: 11, color: "var(--muted)" }}>{m.m}</small>
              </div>
            ))}
          </div>
          <div className="sep" />
          <div className="soft" style={{ fontSize: 12.5 }}>Collection lifts after automated reminders go live — up to <b>95%</b> in July.</div>
        </Card>
      </div>

      <div className="grid g-2">
        <Card title="Recent admissions" link="Admissions" pad={false}>
          <Table
            rows={admissions.slice(0, 5)}
            cols={[
              { label: "Applicant", render: (a) => <div className="who"><Avatar name={a.name} size={30} /><span className="nm">{a.name}</span></div> },
              { label: "Grade", render: (a) => <span className="soft">{a.grade}</span> },
              { label: "Stage", render: (a) => <Pill kind={a.stage === "Enrolled" ? "good" : a.stage === "Offer" ? "info" : "mute"}>{a.stage}</Pill> },
              { label: "Date", align: "r", render: (a) => <span className="soft tnum">{a.date}</span> },
            ]}
          />
        </Card>

        <Card title="Fee defaulters" link="Fees" pad={false}>
          <Table
            rows={defaulters}
            cols={[
              { label: "Student", render: (d) => <div className="who"><Avatar name={d.name} size={30} /><span className="nm">{d.name}</span></div> },
              { label: "Class", render: (d) => <span className="soft">{d.grade}</span> },
              { label: "Overdue", align: "r", render: (d) => <Pill kind={d.days > 30 ? "bad" : d.days > 10 ? "warn" : "mute"}>{d.days}d</Pill> },
              { label: "Amount", align: "r", render: (d) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(d.due)}</span> },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
