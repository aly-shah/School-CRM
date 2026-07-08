"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, StatTile, Pill, gradeClass } from "@/components/ui";
import { I } from "@/components/icons";
import { students } from "@/lib/data";
import { getQuizResults } from "@/lib/store";

export default function Results({ roll = "12" }) {
  const c = students.find((s) => String(s.roll) === String(roll)) || students[0];
  const total = c.subjects.reduce((a, b) => a + b.mark, 0);
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => { getQuizResults(roll).then(setQuizzes); }, [roll]);

  return (
    <>
      <PageHeader title="Results" subtitle={`${c.name} · Term 2 Report Card`}>
        <button className="btn" onClick={() => window.print()}>{I.download}Download PDF</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Overall" tint={{}} value={`${c.overall}%`} sub={`Grade ${c.grade_letter}`} />
        <StatTile label="Class rank" tint={{}} value={`${c.rank} / 32`} sub={`Grade ${c.grade}`} />
        <StatTile label="Total marks" tint={{}} value={`${total} / 500`} sub="5 subjects" />
        <StatTile label="Attendance" tint={{}} value={`${c.attendance}%`} sub="this term" />
      </div>

      <div className="grid g-2">
        <Card title="Subject performance · Term 2">
          {c.subjects.map((s) => (
            <div key={s.name} className="subj">
              <span className="s-nm">{s.name}</span>
              <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${s.mark}%`, background: s.grade.startsWith("B") ? "var(--info)" : "var(--accent)" }} /></div>
              <span className="s-mk tnum">{s.mark}</span>
              <span className={`pill ${gradeClass(s.grade)}`} style={{ width: 38, justifyContent: "center" }}>{s.grade}</span>
            </div>
          ))}
          <div className="subj-foot">
            <span className="muted" style={{ fontSize: 12 }}>Teacher's remark</span>
            <span className="tnum" style={{ fontWeight: 700 }}>{total} / 500 · {c.overall}%</span>
          </div>
          <div className="soft" style={{ fontSize: 13, marginTop: 10 }}>“Excellent progress in problem-solving this term. Keep it up!” — Ms. Karim</div>
        </Card>

        <Card title="Quiz scores">
          {quizzes.length ? (
            <div className="list">
              {quizzes.map((q, i) => {
                const pct = Math.round((q.score / q.total) * 100);
                return (
                  <div key={i} className="list-row">
                    <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.quiz}</span></span>
                    <div className="l-main"><div className="l-t">{q.title}</div><div className="l-s">{q.subject} · {q.at}</div></div>
                    <div className="l-end"><Pill kind={pct >= 50 ? "good" : "warn"}>{q.score}/{q.total}</Pill></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="soft" style={{ fontSize: 13 }}>No quizzes attempted yet. Assigned quizzes and scores will appear here.</div>
          )}
        </Card>
      </div>
    </>
  );
}
