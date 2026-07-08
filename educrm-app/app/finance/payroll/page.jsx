import { PageHeader, StatTile, Card, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { payroll, pkr } from "@/lib/data";

export default function Payroll() {
  const total = payroll.reduce((a, b) => a + b.gross, 0);
  const pending = payroll.filter((p) => p.status === "Pending").length;
  return (
    <>
      <PageHeader title="Payroll" subtitle="June 2025 · salary run">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.wallet}</span>Run payroll</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Gross payroll" tint={{}} value="Rs 1.2 Cr" sub="86 staff" />
        <StatTile label="Processed" tint={{}} value={payroll.length - pending} sub="of shown" />
        <StatTile label="Pending" tint={{}} value={pending} sub="to approve" />
        <StatTile label="Pay date" tint={{}} value="30 Jun" sub="this cycle" />
      </div>

      <Card pad={false}>
        <Table
          minWidth={560}
          rows={payroll}
          cols={[
            { label: "Staff", render: (p) => <div className="who"><Avatar name={p.name} size={30} /><span className="nm">{p.name}</span></div> },
            { label: "Role", render: (p) => <span className="soft">{p.role}</span> },
            { label: "Gross", align: "r", render: (p) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(p.gross)}</span> },
            { label: "Status", align: "r", render: (p) => <Pill kind={p.status === "Processed" ? "good" : "warn"} dot>{p.status}</Pill> },
          ]}
        />
      </Card>
    </>
  );
}
