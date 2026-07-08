import { PageHeader, StatTile, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { approvals } from "@/lib/data";

export default function Approvals() {
  return (
    <>
      <PageHeader title="Approvals" subtitle="Decisions waiting on you — approve or send back" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Pending" tint={{}} value={approvals.length} sub="awaiting decision" />
        <StatTile label="Approved (week)" tint={{}} value="23" sub="this week" />
        <StatTile label="Discounts" tint={{}} value="4" sub="fee concessions" />
        <StatTile label="Avg. turnaround" tint={{}} value="3h" sub="response time" />
      </div>

      <Card pad={false}>
        <div className="card-pad">
          <div className="list">
            {approvals.map((a, i) => (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.approve}</span></span>
                <div className="l-main">
                  <div className="l-t">{a.kind} <span className="muted" style={{ fontWeight: 500 }}>· raised by {a.by}</span></div>
                  <div className="l-s">{a.detail}</div>
                </div>
                <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="muted" style={{ fontSize: 12 }}>{a.when}</span>
                  <button className="btn" style={{ padding: "6px 12px" }}>Reject</button>
                  <button className="btn primary" style={{ padding: "6px 12px" }}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
