import Link from "next/link";
import { PageHeader, Card, StatTile, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { teacherClasses, homework } from "@/lib/data";

export default function TeacherDashboard() {
  return (
    <>
      <PageHeader title="Good morning, Sadia 👋" subtitle="Class Teacher · Grade 6-B · Tuesday, 6 July">
        <Link href="/teacher/attendance" className="btn primary"><span style={{ display: "flex" }}>{I.check}</span>Take attendance</Link>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="My classes" icon={I.book} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={teacherClasses.length} sub="today" />
        <StatTile label="Students" icon={I.students} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={teacherClasses.reduce((a, b) => a + b.students, 0)} sub="across sections" />
        <StatTile label="Attendance" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="Pending" sub="6-B · not marked" />
        <StatTile label="To grade" icon={I.clipboard} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="3" sub="homework submissions" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <Card title="Today's classes" link="Timetable">
          <div className="list">
            {teacherClasses.map((c, i) => (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.book}</span></span>
                <div className="l-main"><div className="l-t">{c.subject} · Grade {c.cls}</div><div className="l-s">{c.students} students · Room {c.room}</div></div>
                <div className="l-end"><Pill kind="mute">{c.next}</Pill></div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Homework you've set" link="Homework">
          <div className="list">
            {homework.slice(0, 4).map((h, i) => (
              <div key={i} className="list-row">
                <div className="l-main"><div className="l-t">{h.title}</div><div className="l-s">{h.subject} · due {h.due}</div></div>
                <div className="l-end"><Pill kind={h.status === "Graded" ? "good" : "info"}>{h.status}</Pill></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Quick actions">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/teacher/attendance" className="btn">{I.check}Take attendance</Link>
          <Link href="/teacher/gradebook" className="btn">{I.book}Enter marks</Link>
          <Link href="/teacher/homework" className="btn">{I.clipboard}Assign homework</Link>
          <Link href="/teacher/timetable" className="btn">{I.timetable}My timetable</Link>
        </div>
      </Card>
    </>
  );
}
