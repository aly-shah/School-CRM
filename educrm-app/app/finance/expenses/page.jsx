import { PageHeader, StatTile, Card, Pill, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { expenses, pkr } from "@/lib/data";

export default function Expenses() {
  const total = expenses.reduce((a, b) => a + b.amount, 0);
  return (
    <>
      <PageHeader title="Expenses" subtitle="Where the money goes — this month">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>Add expense</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Total (month)" tint={{}} value={pkr(total)} sub="5 heads" />
        <StatTile label="Largest head" tint={{}} value="Payroll" sub="86% of spend" />
        <StatTile label="Budget used" tint={{}} value="78%" sub="of monthly budget" />
        <StatTile label="Pending bills" tint={{}} value="3" sub="awaiting approval" />
      </div>

      <Card pad={false}>
        <Table
          rows={expenses}
          footer={<span style={{ fontWeight: 700, color: "var(--ink)" }}>Total · {pkr(total)}</span>}
          cols={[
            { label: "Expense head", render: (e) => <span style={{ fontWeight: 600 }}>{e.head}</span> },
            { label: "Category", render: (e) => <Pill kind="mute">{e.cat}</Pill> },
            { label: "Amount", align: "r", render: (e) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(e.amount)}</span> },
          ]}
        />
      </Card>
    </>
  );
}
