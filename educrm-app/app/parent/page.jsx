import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Avatar, gradeClass } from "@/components/ui";
import { I } from "@/components/icons";
import { students, notices, pkr } from "@/lib/data";
import SignOutButton from "@/components/SignOutButton";

export default function ParentOverview() {
  const c = students[0]; // Ayaan
  return (
    <>
      <PageHeader title="Hi Sana 👋" subtitle="Here's how Ayaan is doing today">
        <SignOutButton />
        <Link href="/parent/fees" className="btn primary"><span style={{ display: "flex" }}>{I.wallet}</span>Pay fees</Link>
      </PageHeader>

      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar name={c.name} size={58} radius fs={22} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</div>
            <div className="soft" style={{ fontSize: 13 }}>Grade {c.grade} · Roll {c.roll} · {c.house} House</div>
          </div>
          <Pill kind="good" dot>Present today</Pill>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={`${c.attendance}%`} sub="this term" />
        <StatTile label="Fees due" icon={I.wallet} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={pkr(c.fees.due)} sub="Term 2 · due 15 Jul" />
        <StatTile label="Overall" icon={I.exams} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={`${c.overall}%`} sub={`Grade ${c.grade_letter} · rank ${c.rank}`} />
        <StatTile label="Next class" icon={I.clock} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="Maths" sub="8:00 · Room 104" />
      </div>

      <div className="grid g-2">
        <Card title="Latest results" link="Results">
          <div className="list">
            {c.subjects.map((s) => (
              <div key={s.name} className="list-row">
                <div className="l-main"><div className="l-t">{s.name}</div></div>
                <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="tnum soft">{s.mark}</span>
                  <span className={`pill ${gradeClass(s.grade)}`} style={{ width: 38, justifyContent: "center" }}>{s.grade}</span>
                </div>
              </div>
            ))}
          </div>
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
