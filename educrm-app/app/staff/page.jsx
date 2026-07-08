import Link from "next/link";
import { PageHeader, Card, StatTile, Avatar, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { notices, payslips, pkr } from "@/lib/data";

export default function StaffDashboard() {
  return (
    <>
      <PageHeader title="Hi Tariq 👋" subtitle="Admin Staff · Administration department">
        <Link href="/staff/leave" className="btn primary"><span style={{ display: "flex" }}>{I.clock}</span>Apply for leave</Link>
      </PageHeader>

      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name="Tariq Javed" size={54} radius fs={20} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Tariq Javed</div>
            <div className="soft" style={{ fontSize: 13 }}>Emp #ST-0142 · joined Apr 2021</div>
          </div>
          <Pill kind="good" dot>On duty</Pill>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Leave balance" icon={I.clock} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="14" sub="days remaining" />
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="97%" sub="this month" />
        <StatTile label="Next payslip" icon={I.receipt} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={pkr(payslips[0].net)} sub={payslips[0].month} />
        <StatTile label="Open tasks" icon={I.clipboard} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="2" sub="assigned to you" />
      </div>

      <div className="grid g-2">
        <Card title="Quick actions">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/staff/leave" className="btn">{I.clock}Apply leave</Link>
            <Link href="/staff/payslips" className="btn">{I.receipt}View payslips</Link>
            <Link href="/staff/directory" className="btn">{I.users}Staff directory</Link>
            <Link href="/staff/notices" className="btn">{I.megaphone}Notices</Link>
          </div>
        </Card>

        <Card title="Latest notices" link="All">
          <div className="list">
            {notices.slice(0, 4).map((n, i) => (
              <div key={i} className="list-row">
                <span style={{ width: 8, height: 8, borderRadius: "50%", flex: "0 0 auto", background: `var(--${n.kind === "mute" ? "muted" : n.kind})` }} />
                <div className="l-main"><div className="l-t">{n.title}</div><div className="l-s">{n.tag}</div></div>
                <span className="muted" style={{ fontSize: 12 }}>{n.when}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
