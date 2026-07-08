"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Avatar, gradeClass } from "@/components/ui";
import { I } from "@/components/icons";
import { notices, pkr } from "@/lib/data";
import { getStudents, getSession } from "@/lib/store";
import SignOutButton from "@/components/SignOutButton";

export default function ParentOverview() {
  const [c, setC] = useState(null);

  useEffect(() => {
    getStudents().then((all) => {
      const roll = getSession();
      setC(all.find((s) => String(s.roll) === String(roll)) || all.find((s) => s.name.includes("Ayaan")) || all[0] || null);
    });
  }, []);

  if (!c) return null;
  const firstName = c.name.split(" ")[0];
  const fees = c.fees || { due: c.feeDue || 0 };
  const subjects = c.subjects || [];

  return (
    <>
      <PageHeader title={`Hi 👋`} subtitle={`Here's how ${firstName} is doing today`}>
        <SignOutButton />
        <Link href="/parent/fees" className="btn primary"><span style={{ display: "flex" }}>{I.wallet}</span>Pay fees</Link>
      </PageHeader>

      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={c.name} size={58} radius fs={22} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</div>
            <div className="soft" style={{ fontSize: 13 }}>Grade {c.grade} · Roll {c.roll}{c.house ? ` · ${c.house} House` : ""}</div>
          </div>
          <Pill kind="good" dot>Present today</Pill>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={`${c.attendance}%`} sub="this term" />
        <StatTile label="Fees due" icon={I.wallet} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={fees.due ? pkr(fees.due) : "Cleared"} sub="Term 2 · due 15 Jul" />
        <StatTile label="Overall" icon={I.exams} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={`${c.overall}%`} sub={`Grade ${c.grade_letter} · rank ${c.rank}`} />
        <StatTile label="Certificates" icon={I.award} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="View" sub="awards & achievements" />
      </div>

      <div className="grid g-2">
        <Card title="Latest results" link="Results">
          {subjects.length ? (
            <div className="list">
              {subjects.map((s) => (
                <div key={s.name} className="list-row">
                  <div className="l-main"><div className="l-t">{s.name}</div></div>
                  <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="tnum soft">{s.mark}</span>
                    <span className={`pill ${gradeClass(s.grade)}`} style={{ width: 38, justifyContent: "center" }}>{s.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="soft" style={{ fontSize: 13 }}>Term 2 results will appear here once published.</div>
          )}
        </Card>

        <Card title="School notices" link="All notices">
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
