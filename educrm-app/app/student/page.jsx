import Link from "next/link";
import { PageHeader, Card, StatTile, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { students, timetable, subjectColor } from "@/lib/data";
import ClassTeacherCard from "@/components/ClassTeacherCard";

export default function StudentOverview() {
  const me = students[0]; // Ayaan
  const today = timetable.grid[0]; // Monday
  return (
    <>
      <PageHeader title="Hi Ayaan 👋" subtitle="Grade 6-B · Monday, 6 July">
        <Link href="/student/quizzes" className="btn primary"><span style={{ display: "flex" }}>{I.quiz}</span>Take a quiz</Link>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Attendance" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={`${me.attendance}%`} sub="this term" />
        <StatTile label="Next class" icon={I.clock} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="Maths" sub="8:00 · Room 104" />
        <StatTile label="Homework" icon={I.clipboard} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="4" sub="due this week" />
        <StatTile label="Overall" icon={I.star} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={`${me.overall}%`} sub={`Grade ${me.grade_letter} · rank ${me.rank}`} />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <ClassTeacherCard grade={me.grade} />
        <Card title="Quick links">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/student/homework" className="btn">{I.clipboard}My homework</Link>
            <Link href="/student/quizzes" className="btn">{I.quiz}Quizzes</Link>
            <Link href="/student/results" className="btn">{I.star}My results</Link>
            <Link href="/student/attendance" className="btn">{I.attendance}Attendance</Link>
            <Link href="/student/timetable" className="btn">{I.timetable}Timetable</Link>
          </div>
        </Card>
      </div>

      <Card title="Today's classes" link="Timetable">
        <div className="list">
          {today.map((subj, i) => {
            const c = subjectColor[subj] || "var(--muted)";
            return (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: `${c}18`, color: c }}><span style={{ display: "grid", placeItems: "center" }}>{I.book}</span></span>
                <div className="l-main"><div className="l-t">{subj}</div><div className="l-s">Period {i + 1}</div></div>
                <div className="l-end"><Pill kind="mute">{timetable.periods[i]}</Pill></div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
