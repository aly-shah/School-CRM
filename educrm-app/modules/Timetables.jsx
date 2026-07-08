"use client";
import { Fragment, useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { timetableDays as DAYS, timetablePeriods as PERIODS, subjects, subjectColor } from "@/lib/data";
import { getClasses, addClass, updateClassGrid } from "@/lib/store";

const OPTS = [...subjects, "—"];
const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", width: "100%", boxSizing: "border-box" };

export default function Timetables() {
  const [classes, setClasses] = useState([]);
  const [selId, setSelId] = useState(null);
  const [grid, setGrid] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", teacher: "", room: "", students: "" });

  useEffect(() => { getClasses().then(setClasses); }, []);
  const sel = classes.find((c) => c.id === selId);

  const open = (c) => { setSelId(c.id); setGrid(c.grid.map((r) => [...r])); setEditing(false); };
  const back = () => { setSelId(null); setEditing(false); };
  const setCell = (di, pi, val) => setGrid((g) => g.map((r, i) => (i === di ? r.map((c, j) => (j === pi ? val : c)) : r)));
  const save = async () => { await updateClassGrid(selId, grid); setClasses(await getClasses()); setEditing(false); };

  const createClass = async () => {
    const raw = form.name.trim();
    if (!raw) return;
    const id = raw.replace(/^grade\s*/i, "");
    if (classes.some((c) => c.id === id)) { alert("A class with that name already exists."); return; }
    const empty = DAYS.map(() => PERIODS.map(() => "—"));
    const cls = { id, name: /^grade/i.test(raw) ? raw : `Grade ${raw}`, teacher: form.teacher.trim() || "Unassigned", room: form.room.trim() || "—", students: Number(form.students) || 0, grid: empty };
    try { await addClass(cls); } catch (e) { alert(String(e.message || e)); return; }
    setClasses(await getClasses());
    setAdding(false); setForm({ name: "", teacher: "", room: "", students: "" });
    open(cls); setEditing(true);
  };

  // ---------------- DETAIL / EDIT ----------------
  if (sel && grid) {
    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); back(); }} className="soft" style={{ fontSize: 13 }}>&larr; All classes</a>
        </div>
        <PageHeader title={`${sel.name} — timetable`} subtitle={`Class Teacher: ${sel.teacher} · Room ${sel.room} · ${sel.students} students`}>
          {editing
            ? <><button className="btn" onClick={() => open(sel)}>Cancel</button><button className="btn primary" onClick={save}>{I.check}Save timetable</button></>
            : <button className="btn primary" onClick={() => setEditing(true)}>{I.edit}Edit timetable</button>}
        </PageHeader>

        <div className="card card-pad" style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: `70px repeat(${PERIODS.length}, minmax(104px,1fr))`, gap: 8, minWidth: 760 }}>
            <div />
            {PERIODS.map((p) => <div key={p} className="tnum" style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", fontWeight: 600 }}>{p}</div>)}
            {DAYS.map((day, di) => (
              <Fragment key={day}>
                <div style={{ display: "flex", alignItems: "center", fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{day}</div>
                {grid[di].map((subj, pi) => {
                  const c = subjectColor[subj];
                  if (editing) {
                    return (
                      <select key={pi} value={subj} onChange={(e) => setCell(di, pi, e.target.value)}
                        style={{ ...inp, padding: "8px 6px", background: c ? `${c}14` : "var(--panel)", borderColor: c ? `${c}44` : "var(--line)", fontWeight: 600, textAlign: "center" }}>
                        {OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    );
                  }
                  return c ? (
                    <div key={pi} style={{ background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, margin: "0 auto 6px" }} />
                      <div style={{ fontSize: 12.5, fontWeight: 600 }}>{subj}</div>
                    </div>
                  ) : (
                    <div key={pi} style={{ border: "1px dashed var(--line)", borderRadius: 10, padding: "12px 8px", textAlign: "center", color: "var(--faint)", fontSize: 12 }}>Free</div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ---------------- LIST ----------------
  return (
    <>
      <PageHeader title="Timetables" subtitle="One timetable per class — click a class to view or edit">
        <button className="btn primary" onClick={() => setAdding((a) => !a)}>{I.plus}Add class</button>
      </PageHeader>

      {adding && (
        <Card title="New class" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Class name — e.g. 7-C" style={{ ...inp, flex: "1 1 160px", width: "auto" }} />
            <input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} placeholder="Class teacher" style={{ ...inp, flex: "1 1 160px", width: "auto" }} />
            <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room" style={{ ...inp, flex: "0 1 110px", width: "auto" }} />
            <input value={form.students} onChange={(e) => setForm({ ...form, students: e.target.value })} placeholder="Students" type="number" style={{ ...inp, flex: "0 1 110px", width: "auto" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn primary" onClick={createClass} style={{ marginLeft: "auto" }}>{I.plus}Create &amp; build timetable</button>
          </div>
        </Card>
      )}

      <div className="grid g-3">
        {classes.map((c) => {
          const filled = c.grid.flat().filter((x) => x && x !== "—").length;
          const total = DAYS.length * PERIODS.length;
          return (
            <a key={c.id} href="#" onClick={(e) => { e.preventDefault(); open(c); }} className="card card-pad" style={{ display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ width: 42, height: 42, borderRadius: 12, background: "var(--accent-weak)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                  <span style={{ display: "grid", placeItems: "center", width: 20, height: 20 }}>{I.timetable}</span>
                </span>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{c.name}</div>
                  <div className="soft" style={{ fontSize: 12.5 }}>{c.teacher}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <Pill kind="mute">Room {c.room}</Pill>
                <Pill kind="mute">{c.students} students</Pill>
                <Pill kind={filled === total ? "good" : "warn"}>{filled}/{total} periods</Pill>
              </div>
              <span className="link" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}>View timetable →</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
