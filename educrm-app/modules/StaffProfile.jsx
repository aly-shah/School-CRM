"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { getStaff } from "@/lib/store";

export default function StaffProfile({ id, base = "/admin" }) {
  const [m, setM] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getStaff().then((all) => { setM(all.find((x) => String(x.id) === String(id)) || null); setReady(true); });
  }, [id]);

  if (!ready) return null;
  if (!m) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p className="soft">Staff member not found.</p>
      <div style={{ marginTop: 12 }}><Link href={`${base}/staff`} className="btn">&larr; All staff</Link></div>
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Link href={`${base}/staff`} className="soft" style={{ fontSize: 13 }}>&larr; All staff</Link>
      </div>

      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Avatar name={m.name} size={60} radius fs={22} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 19, fontWeight: 700 }}>{m.name}</div>
            <div className="soft" style={{ fontSize: 13 }}>{m.role} · {m.dept}</div>
          </div>
          <Pill kind={m.status === "On duty" ? "good" : "warn"} dot>{m.status}</Pill>
          <button className="btn primary">{I.msg}Message</button>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="96%" sub="this month" />
        <StatTile label="Leave balance" icon={I.clock} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="14" sub="days remaining" />
        <StatTile label="This month" icon={I.fees} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="Rs 1.4 L" sub="gross salary" />
        <StatTile label="Tenure" icon={I.staff} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="4 yrs" sub="since Apr 2021" />
      </div>

      <div className="grid g-2">
        <Card title="Details">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Row k="Full name" v={m.name} />
            <Row k="Role" v={m.role} />
            <Row k="Department" v={m.dept} />
            <Row k="Phone" v={m.phone} tnum />
            <Row k="Employee ID" v={`ST-${String(m.id).padStart(4, "0")}`} tnum />
            <Row k="Status" v={m.status} />
          </div>
        </Card>

        <Card title="Recent activity">
          <div className="list">
            <ActivityRow c="var(--good)" t="Attendance marked" s="On duty · today 8:02 AM" />
            <ActivityRow c="var(--info)" t="Payslip generated" s="June 2025 · Rs 1.31 L net" />
            <ActivityRow c="var(--warn)" t="Leave approved" s="2 days casual · 12–13 Jul" />
          </div>
        </Card>
      </div>
    </>
  );
}

function Row({ k, v, tnum }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5, borderBottom: "1px solid var(--line-soft)", paddingBottom: 10 }}>
      <span className="muted">{k}</span>
      <span className={tnum ? "tnum" : ""} style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
    </div>
  );
}
function ActivityRow({ c, t, s }) {
  return (
    <div className="list-row">
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flex: "0 0 auto", marginTop: 6 }} />
      <div className="l-main"><div className="l-t">{t}</div><div className="l-s">{s}</div></div>
    </div>
  );
}
