import { PageHeader, StatTile, Card, Pill, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { leaveRequests } from "@/lib/data";

export default function Leave() {
  return (
    <>
      <PageHeader title="Leave" subtitle="Apply for leave and track your requests">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>Apply for leave</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Casual" tint={{}} value="8" sub="of 12 left" />
        <StatTile label="Sick" tint={{}} value="6" sub="of 8 left" />
        <StatTile label="Earned" tint={{}} value="12" sub="of 15 left" />
        <StatTile label="Pending" tint={{}} value={leaveRequests.filter((l) => l.status === "Pending").length} sub="awaiting approval" />
      </div>

      <Card title="My requests" pad={false}>
        <Table
          minWidth={520}
          rows={leaveRequests}
          cols={[
            { label: "Type", render: (l) => <span style={{ fontWeight: 600 }}>{l.type}</span> },
            { label: "From", render: (l) => <span className="soft">{l.from}</span> },
            { label: "To", render: (l) => <span className="soft">{l.to}</span> },
            { label: "Days", align: "r", render: (l) => <span className="tnum">{l.days}</span> },
            { label: "Status", align: "r", render: (l) => <Pill kind={l.status === "Approved" ? "good" : "warn"} dot>{l.status}</Pill> },
          ]}
        />
      </Card>
    </>
  );
}
