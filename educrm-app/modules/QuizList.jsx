"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { getQuizzes, getQuizResults, addQuizResult } from "@/lib/store";

const ROLL = "12";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(null);

  useEffect(() => { getQuizzes().then(setQuizzes); getQuizResults(ROLL).then(setResults); }, []);

  const start = (quiz) => { setActive(quiz); setAnswers({}); setDone(null); };
  const submit = async () => {
    let score = 0;
    active.questions.forEach((q, i) => { if (answers[i] === q.answer) score++; });
    const r = { roll: ROLL, quizId: active.id, title: active.title, subject: active.subject, score, total: active.questions.length, at: new Date().toLocaleDateString() };
    setResults([r, ...results.filter((x) => !(x.quizId === active.id && String(x.roll) === ROLL))]);
    setDone({ score, total: active.questions.length });
    await addQuizResult(r);
  };

  // ---- taking a quiz ----
  if (active && !done) {
    const allAnswered = active.questions.every((_, i) => answers[i] !== undefined);
    return (
      <>
        <PageHeader title={active.title} subtitle={`${active.subject} · ${active.questions.length} questions`} />
        <div className="card card-pad">
          {active.questions.map((q, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{i + 1}. {q.q}</div>
              <div style={{ display: "grid", gap: 8 }}>
                {q.options.map((o, k) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${answers[i] === k ? "var(--accent)" : "var(--line)"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", background: answers[i] === k ? "var(--accent-weak)" : "var(--panel)" }}>
                    <input type="radio" name={`q${i}`} checked={answers[i] === k} onChange={() => setAnswers({ ...answers, [i]: k })} />
                    <span style={{ fontSize: 13.5 }}>{o}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setActive(null)}>Cancel</button>
            <button className="btn primary" onClick={submit} disabled={!allAnswered} style={{ marginLeft: "auto" }}>{I.check}Submit quiz</button>
          </div>
        </div>
      </>
    );
  }

  // ---- result screen ----
  if (done) {
    const pct = Math.round((done.score / done.total) * 100);
    return (
      <>
        <PageHeader title="Quiz submitted 🎉" subtitle={active.title} />
        <div className="card card-pad" style={{ textAlign: "center", padding: 34 }}>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-.03em", color: pct >= 50 ? "var(--good)" : "var(--bad)" }}>{done.score}/{done.total}</div>
          <div className="soft" style={{ marginBottom: 4 }}>You scored {pct}%</div>
          <Pill kind={pct >= 80 ? "good" : pct >= 50 ? "info" : "warn"}>{pct >= 80 ? "Excellent" : pct >= 50 ? "Passed" : "Needs practice"}</Pill>
          <div style={{ marginTop: 20 }}><button className="btn primary" onClick={() => { setActive(null); setDone(null); }}>Back to quizzes</button></div>
        </div>
      </>
    );
  }

  // ---- list ----
  return (
    <>
      <PageHeader title="Quizzes" subtitle="Attempt quizzes assigned by your teachers" />
      <Card pad={false}>
        <div className="card-pad">
          <div className="list">
            {quizzes.map((q) => {
              const r = results.find((x) => x.quizId === q.id && String(x.roll) === ROLL);
              return (
                <div key={q.id} className="list-row">
                  <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.quiz}</span></span>
                  <div className="l-main"><div className="l-t">{q.title}</div><div className="l-s">{q.subject} · {q.questions.length} questions · by {q.by}</div></div>
                  <div className="l-end">
                    {r
                      ? <Pill kind={r.score / r.total >= 0.5 ? "good" : "warn"}>Scored {r.score}/{r.total}</Pill>
                      : <button className="btn primary" style={{ padding: "6px 14px" }} onClick={() => start(q)}>Start</button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}
