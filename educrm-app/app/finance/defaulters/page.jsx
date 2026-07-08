import { PageHeader, StatTile, Card, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { defaulters, pkr } from "@/lib/data";

export default function Defaulters() {
  const total = defaulters.reduce((a, b) => a + b.due, 0);
  return (
    <>
      <PageHeader title="Defaulters" subtitle="Outstanding dues — chase and recover">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.msg}</span>Remind all</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Total overdue" tint={{}} value={pkr(total)} sub={`${defaulters.length} students`} />
        <StatTile label="Over 30 days" tint={{}} value="1" sub="escalate" />
        <StatTile label="Reminders sent" tint={{}} value="184" sub="this month" />
        <StatTile label="Recovered (mo.)" tint={{}} value="Rs 12.4 L" sub="after reminders" />
      </div>

      <Card pad={false}>
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
