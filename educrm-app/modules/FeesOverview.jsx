import { PageHeader, StatTile, Card, Donut, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { feeMonths, defaulters, pkr } from "@/lib/data";

export default function FeesOverview({ title = "Fees & Finance", subtitle = "Real-time collection — no more month-end guesswork" }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export</button>
        <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>Record payment</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Collected (term)" icon={I.fees} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="Rs 4.68 Cr" sub="88% of billed" />
        <StatTile label="Outstanding" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="Rs 63.8 L" sub="112 students" />
        <StatTile label="Overdue > 30d" icon={I.bell} tint={{ bg: "var(--bad-bg)", fg: "var(--bad)" }} value="Rs 18.9 L" sub="8 students" />
        <StatTile label="Online payments" icon={I.check} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="73%" sub="of all collections" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <Card title="Collection trend">
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

        <Card title="Collection status · today">
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Donut pct={88} label="Collected" />
            <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
              <Row color="var(--accent)" k="Paid" v="88%" />
              <Row color="var(--warn)" k="Partial" v="8%" />
              <Row color="var(--bad)" k="Overdue" v="4%" />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Defaulters" link="Send reminders" pad={false}>
        <Table
          rows={defaulters}
          cols={[
            { label: "Student", render: (d) => <div className="who"><Avatar name={d.name} size={30} /><span className="nm">{d.name}</span></div> },
            { label: "Class", render: (d) => <span className="soft">{d.grade}</span> },
            { label: "Overdue by", align: "r", render: (d) => <Pill kind={d.days > 30 ? "bad" : d.days > 10 ? "warn" : "mute"}>{d.days} days</Pill> },
            { label: "Amount", align: "r", render: (d) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(d.due)}</span> },
            { label: "Action", align: "r", render: () => <button className="btn" style={{ padding: "6px 12px" }}>Remind</button> },
          ]}
        />
      </Card>
    </>
  );
}

function Row({ color, k, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />{k}
      <span className="tnum" style={{ marginLeft: "auto", fontWeight: 700 }}>{v}</span>
    </div>
  );
}
