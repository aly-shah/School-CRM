import Link from "next/link";
import { PageHeader, Card, StatTile, Donut } from "@/components/ui";
import { I } from "@/components/icons";
import { feeMonths, expenses, pkr } from "@/lib/data";

export default function FinanceDashboard() {
  const totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  return (
    <>
      <PageHeader title="Finance dashboard" subtitle="Collections, dues and cash position — live">
        <Link href="/finance/collections" className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>Record payment</Link>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Collected (term)" icon={I.fees} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="Rs 4.68 Cr" sub="88% of billed" />
        <StatTile label="Outstanding" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="Rs 63.8 L" sub="112 students" />
        <StatTile label="Today's payments" icon={I.wallet} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="Rs 3.2 L" sub="41 transactions" />
        <StatTile label="Net position" icon={I.receipt} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="Rs 2.1 Cr" sub="income − expense" />
      </div>

      <div className="grid g-2">
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

        <Card title="Expenses breakdown" link="Details">
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {expenses.map((e) => (
              <div key={e.head} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 130, fontSize: 12.5, color: "var(--ink-soft)" }}>{e.head}</span>
                <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${(e.amount / totalExp) * 100}%` }} /></div>
                <span className="tnum" style={{ width: 70, textAlign: "right", fontWeight: 600, fontSize: 12 }}>{pkr(e.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
