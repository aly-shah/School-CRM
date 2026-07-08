"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { pkr } from "@/lib/data";
import { getStudents, addStudent } from "@/lib/store";

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0 };

export default function StudentsTable({ base = "/admin" }) {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("All");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "", roll: "", gender: "Male" });
  const [err, setErr] = useState("");

  useEffect(() => { getStudents().then(setList); }, []);

  const grades = ["All", ...Array.from(new Set(list.map((s) => s.grade))).sort()];
  const rows = list.filter((s) => {
    const okQ = (s.name + s.id).toLowerCase().includes(q.toLowerCase());
    const okG = grade === "All" || s.grade === grade;
    return okQ && okG;
  });

  const create = async () => {
    if (!form.name.trim() || !form.grade.trim()) { setErr("Name and class are required."); return; }
    const rollNum = Number(form.roll);
    if (!rollNum) { setErr("Enter a valid roll number."); return; }
    const cls = form.grade.trim();
    if (list.some((x) => x.grade === cls && Number(x.roll) === rollNum)) {
      setErr(`Roll number ${rollNum} is already used in class ${cls}. Pick a different roll number.`);
      return;
    }
    const id = "2026-" + String(Date.now()).slice(-4);
    const s = {
      id, name: form.name.trim(), grade: cls, roll: rollNum, gender: form.gender,
      status: "Active", attendance: 100, overall: 0, grade_letter: "—", rank: "—",
      feeDue: 180000, fees: { annual: 180000, paid: 0, due: 180000 },
    };
    try { await addStudent(s); }
    catch (e) { setErr(String(e.message || e)); return; }
    setList(await getStudents());
    setForm({ name: "", grade: "", roll: "", gender: "Male" });
    setErr(""); setAdding(false);
  };

  return (
    <>
      <PageHeader title="Students" subtitle={`${list.length} enrolled · Session 2025–26`}>
        <button className="btn"><span style={{ display: "flex" }}>{I.download}</span>Export</button>
        <button className="btn primary" onClick={() => setAdding((a) => !a)}><span style={{ display: "flex" }}>{I.plus}</span>Add student</button>
      </PageHeader>

      {adding && (
        <Card title="New student" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={{ ...inp, flex: "2 1 200px" }} />
            <input value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="Class — e.g. 6-B" style={{ ...inp, flex: "1 1 130px" }} />
            <input value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} placeholder="Roll no." type="number" style={{ ...inp, flex: "0 1 110px" }} />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ ...inp, flex: "0 1 120px" }}>
              <option>Male</option><option>Female</option>
            </select>
          </div>
          {err && <div style={{ color: "var(--bad)", fontSize: 12.5, marginBottom: 10 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => { setAdding(false); setErr(""); }}>Cancel</button>
            <button className="btn primary" onClick={create} style={{ marginLeft: "auto" }}>{I.plus}Add student</button>
          </div>
        </Card>
      )}

      <div className="card">
        <div style={{ display: "flex", gap: 10, padding: 14, borderBottom: "1px solid var(--line-soft)", flexWrap: "wrap", alignItems: "center" }}>
          <div className="search" style={{ margin: 0 }}>
            {I.search}
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or admission #" />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {grades.map((g) => (
              <button key={g} className="pill" onClick={() => setGrade(g)}
                style={{ cursor: "pointer", border: "1px solid var(--line)", background: grade === g ? "var(--accent)" : "var(--panel)", color: grade === g ? "#fff" : "var(--ink-soft)" }}>
                {g}
              </button>
            ))}
          </div>
          <span className="muted" style={{ marginLeft: "auto", fontSize: 12.5 }}>{rows.length} shown</span>
        </div>

        <Table
          minWidth={720}
          rows={rows}
          empty="No students match your search."
          cols={[
            { label: "Student", render: (s) => (
              <Link href={`${base}/students/${s.id}`} className="who">
                <Avatar name={s.name} size={32} />
                <span><span className="nm">{s.name}</span><br /><span className="sc">Roll {s.roll} · {s.gender}</span></span>
              </Link>
            ) },
            { label: "Admission #", render: (s) => <span className="soft tnum">{s.id}</span> },
            { label: "Class", render: (s) => <span className="soft">{s.grade}</span> },
            { label: "Status", render: (s) => <Pill kind={s.status === "Active" ? "good" : "mute"} dot>{s.status}</Pill> },
            { label: "Attendance", align: "r", render: (s) => <span className="tnum" style={{ color: s.attendance < 75 ? "var(--bad)" : "var(--ink)" }}>{s.attendance}%</span> },
            { label: "Overall", align: "r", render: (s) => <span className="tnum">{s.overall}%</span> },
            { label: "Fees due", align: "r", render: (s) => <span className="tnum" style={{ fontWeight: 700, color: s.feeDue ? "var(--warn)" : "var(--good)" }}>{s.feeDue ? pkr(s.feeDue) : "Cleared"}</span> },
          ]}
        />
      </div>
    </>
  );
}
