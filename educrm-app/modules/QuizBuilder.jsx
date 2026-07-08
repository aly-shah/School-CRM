"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { getQuizzes, addQuiz, getQuizResults } from "@/lib/store";

const SUBJECTS = ["Mathematics", "Science", "English", "Computer", "Social Studies"];
const blankQ = () => ({ q: "", options: ["", "", "", ""], answer: 0 });
const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", width: "100%", boxSizing: "border-box" };

export default function QuizBuilder() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [qs, setQs] = useState([blankQ()]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => { getQuizzes().then(setQuizzes); getQuizResults().then(setResults); }, []);

  const setQ = (i, patch) => setQs((arr) => arr.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const setOpt = (i, k, v) => setQs((arr) => arr.map((q, j) => (j === i ? { ...q, options: q.options.map((o, m) => (m === k ? v : o)) } : q)));

  const save = async () => {
    const valid = qs.filter((q) => q.q.trim() && q.options.every((o) => o.trim()));
    if (!title.trim() || !valid.length) return;
    const quiz = { id: Date.now(), title: title.trim(), subject, by: "Sadia Karim", questions: valid };
    await addQuiz(quiz);
    setQuizzes(await getQuizzes());
    setTitle(""); setQs([blankQ()]);
  };

  const subs = (id) => results.filter((r) => r.quizId === id).length;

  return (
    <>
      <PageHeader title="Quizzes" subtitle="Build auto-graded quizzes for Grade 6-B" />

      <Card title="Create a quiz" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" style={{ ...inp, flex: "2 1 220px", width: "auto" }} />
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ ...inp, flex: "1 1 150px", width: "auto" }}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {qs.map((q, i) => (
          <div key={i} style={{ border: "1px solid var(--line-soft)", borderRadius: 11, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span className="pill mute" style={{ flex: "0 0 auto" }}>Q{i + 1}</span>
              <input value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} placeholder="Question" style={inp} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {q.options.map((o, k) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--line)", borderRadius: 9, padding: "6px 10px", background: q.answer === k ? "var(--good-bg)" : "var(--panel)" }}>
                  <input type="radio" name={`ans-${i}`} checked={q.answer === k} onChange={() => setQ(i, { answer: k })} title="Mark correct" />
                  <input value={o} onChange={(e) => setOpt(i, k, e.target.value)} placeholder={`Option ${k + 1}`} style={{ ...inp, border: "none", padding: "2px 0", background: "transparent" }} />
                </label>
              ))}
            </div>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>● Select the radio next to the correct option</div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setQs([...qs, blankQ()])}>{I.plus}Add question</button>
          <button className="btn primary" onClick={save} style={{ marginLeft: "auto" }}>{I.check}Publish quiz</button>
        </div>
      </Card>

      <Card title="Published quizzes" pad={false}>
        <div className="card-pad">
          <div className="list">
            {quizzes.map((q) => (
              <div key={q.id} className="list-row">
                <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.quiz}</span></span>
                <div className="l-main"><div className="l-t">{q.title}</div><div className="l-s">{q.subject} · {q.questions.length} questions</div></div>
                <div className="l-end"><Pill kind="mute">{subs(q.id)} submissions</Pill></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
