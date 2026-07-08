import { PageHeader, StatTile, Card, Pill, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { payslips, pkr } from "@/lib/data";

export default function Payslips() {
  return (
    <>
      <PageHeader title="Payslips" subtitle="Your salary history — download anytime" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Latest net" tint={{}} value={pkr(payslips[0].net)} sub={payslips[0].month} />
        <StatTile label="Annual (est.)" tint={{}} value="Rs 15.7 L" sub="gross" />
        <StatTile label="Tax deducted" tint={{}} value="Rs 1.4 L" sub="YTD" />
        <StatTile label="Payslips" tint={{}} value={payslips.length} sub="available" />
      </div>

      <Card pad={false}>
        <Table
          minWidth={520}
          rows={payslips}
          cols={[
            { label: "Month", render: (p) => <span style={{ fontWeight: 600 }}>{p.month}</span> },
            { label: "Gross", align: "r", render: (p) => <span className="tnum soft">{pkr(p.gross)}</span> },
            { label: "Net paid", align: "r", render: (p) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(p.net)}</span> },
            { label: "Status", align: "r", render: (p) => <Pill kind="good" dot>{p.status}</Pill> },
            { label: "", align: "r", render: () => <button className="btn" style={{ padding: "6px 12px" }}>{I.download}PDF</button> },
          ]}
        />
      </Card>
    </>
  );
}
