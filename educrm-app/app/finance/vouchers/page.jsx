import Link from "next/link";
import { PageHeader, StatTile, Card, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { students, pkr } from "@/lib/data";

export default function Vouchers() {
  const withDue = students.filter((s) => (s.fees?.due ?? s.feeDue) > 0);
  return (
    <>
      <PageHeader title="Fee vouchers" subtitle="Generate, print and share Term 2 fee vouchers">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.receipt}</span>Generate batch</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Vouchers due" tint={{}} value={withDue.length} sub="students with dues" />
        <StatTile label="Generated" tint={{}} value="1,172" sub="this term" />
        <StatTile label="Paid" tint={{}} value="88%" sub="of generated" />
        <StatTile label="Total billed" tint={{}} value="Rs 5.32 Cr" sub="Term 2" />
      </div>

      <Card title="Students with outstanding dues" pad={false}>
        <Table
          minWidth={620}
          rows={students}
          cols={[
            { label: "Student", render: (s) => <div className="who"><Avatar name={s.name} size={30} /><span className="nm">{s.name}</span></div> },
            { label: "Class", render: (s) => <span className="soft">{s.grade}</span> },
            { label: "Admission #", render: (s) => <span className="soft tnum">{s.id}</span> },
            { label: "Due", align: "r", render: (s) => { const d = s.fees?.due ?? s.feeDue; return <span className="tnum" style={{ fontWeight: 700, color: d ? "var(--warn)" : "var(--good)" }}>{d ? pkr(d) : "Cleared"}</span>; } },
            { label: "Voucher", align: "r", render: (s) => <Link href={`/finance/vouchers/${s.id}`} className="btn" style={{ padding: "6px 12px" }}>{I.receipt}Generate</Link> },
          ]}
        />
      </Card>
    </>
  );
}
