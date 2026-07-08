"use client";
import { useState } from "react";
import { PageHeader, StatTile, Avatar, Table, Pill, gradeClass } from "@/components/ui";
import { I } from "@/components/icons";
import { gradebook, teacherClasses } from "@/lib/data";

const letter = (m) => (m >= 90 ? "A+" : m >= 80 ? "A" : m >= 70 ? "B+" : m >= 60 ? "B" : m >= 50 ? "C" : "F");

export default function Gradebook() {
  const [rows, setRows] = useState(gradebook);
  const [saved, setSaved] = useState(false);
  const [active, setActive] = useState(0);
  const setMark = (roll, v) => {
    const n = Math.max(0, Math.min(100, Number(v) || 0));
    setRows((rs) => rs.map((r) => (r.roll === roll ? { ...r, marks: n } : r)));
    setSaved(false);
  };
  const avg = Math.round(rows.reduce((a, b) => a + b.marks, 0) / rows.length);
  const top = rows.reduce((a, b) => (b.marks > a.marks ? b : a), rows[0]);

  return (
    <>
      <PageHeader title="Gradebook" subtitle="Unit Test 3 · enter marks by class">
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export</button>
        <button className="btn primary" onClick={() => setSaved(true)}>{I.check}{saved ? "Saved" : "Save marks"}</button>
      </PageHeader>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {teacherClasses.map((c, i) => (
          <button key={i} onClick={() => setActive(i)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", padding: "7px 12px", background: active === i ? "var(--accent)" : "var(--panel)", color: active === i ? "#fff" : "var(--ink-soft)" }}>
            {c.subject} · {c.cls}
          </button>
        ))}
      </div>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Class average" tint={{}} value={`${avg}%`} sub={`${rows.length} students`} />
        <StatTile label="Highest" tint={{}} value={`${top.marks}`} sub={top.name} />
        <StatTile label="Pass rate" tint={{}} value={`${Math.round((rows.filter((r) => r.marks >= 50).length / rows.length) * 100)}%`} sub="≥ 50 marks" />
        <StatTile label="Status" tint={{}} value={saved ? "Saved" : "Draft"} sub={saved ? "published to report cards" : "unsaved changes"} />
      </div>

      <div className="card">
        <div className="card-h"><h3>{teacherClasses[active].subject} · Grade {teacherClasses[active].cls}</h3>{saved && <span className="pill good"><span className="d" />Saved</span>}</div>
        <Table
          minWidth={460}
          rows={rows}
          cols={[
            { label: "Student", render: (r) => <div className="who"><Avatar name={r.name} size={30} /><span className="nm">{r.name}</span></div> },
            { label: "Roll", render: (r) => <span className="soft tnum">{r.roll}</span> },
            { label: "Marks / 100", align: "r", render: (r) => (
              <input type="number" value={r.marks} min={0} max={100} onChange={(e) => setMark(r.roll, e.target.value)}
                style={{ width: 68, padding: "6px 8px", border: "1px solid var(--line)", borderRadius: 8, fontFamily: "inherit", fontSize: 13, textAlign: "right" }} />
            ) },
            { label: "Grade", align: "r", render: (r) => <span className={`pill ${gradeClass(letter(r.marks))}`} style={{ width: 40, justifyContent: "center" }}>{letter(r.marks)}</span> },
          ]}
        />
      </div>
    </>
  );
}
