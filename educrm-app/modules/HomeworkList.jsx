"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { subjectColor } from "@/lib/data";
import { getHomework, addHomework, submitHomework, getTeacherSession } from "@/lib/store";
import { firstClass } from "@/lib/classes";

const ROLL = "12";
const SUBJECTS = ["Mathematics", "Science", "English", "Computer", "Social Studies", "Hindi"];

function Attach({ a }) {
  if (!a) return null;
  const isImg = a.type?.startsWith("image/");
  return isImg ? (
    <a href={a.data} target="_blank" rel="noreferrer" title={a.name}>
      <img src={a.data} alt={a.name} style={{ width: 46, height: 46, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)", display: "block" }} />
    </a>
  ) : (
    <a href={a.data} download={a.name} className="btn" style={{ padding: "6px 10px" }}>{I.file}{a.name.length > 16 ? a.name.slice(0, 14) + "…" : a.name}</a>
  );
}

export default function HomeworkList({ role = "teacher" }) {
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const [list, setList] = useState([]);
  const [subs, setSubs] = useState({});
  const [form, setForm] = useState({ title: "", subject: "Mathematics", due: "Tomorrow", desc: "" });
  const [file, setFile] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (isTeacher) setMe(getTeacherSession());
    getHomework().then((all) => {
      setList(all);
      const s = {}; all.forEach((h) => { s[h.id] = (h.subs || []).includes(ROLL); });
      setSubs(s);
    });
  }, []);
  const myClass = firstClass(me?.classes);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) { setFile(null); return; }
    const r = new FileReader();
    r.onload = () => setFile({ name: f.name, type: f.type, data: r.result });
    r.readAsDataURL(f);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const item = { id: Date.now(), title: form.title.trim(), subject: form.subject, cls: myClass, due: form.due || "This week", desc: form.desc.trim(), attach: file, status: "Open", teacherId: me?.id, teacherName: me?.name };
    await addHomework(item);
    setList(await getHomework());
    setForm({ title: "", subject: form.subject, due: "Tomorrow", desc: "" });
    setFile(null);
    e.target.reset();
  };

  const doSubmit = async (id) => { setSubs({ ...subs, [id]: true }); await submitHomework(id, ROLL); };

  const subtitle = isTeacher ? `Assign work and attach files for Grade ${myClass}` : isStudent ? "Your assignments · Grade 6-B" : "Ayaan's assignments · Grade 6-B";

  return (
    <>
      <PageHeader title="Homework" subtitle={subtitle} />

      {isTeacher && (
        <Card title="Assign homework" style={{ marginBottom: 20 }}>
          <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title — e.g. Exercise 7.2" style={{ ...inp, flex: "2 1 220px" }} />
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={{ ...inp, flex: "1 1 140px" }}>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="Due" style={{ ...inp, flex: "0 1 130px" }} />
            </div>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Instructions (optional)" rows={2} style={{ ...inp, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label className="btn" style={{ cursor: "pointer" }}>
                {I.attach}{file ? "Change file" : "Attach image / PDF"}
                <input type="file" accept="image/*,application/pdf" onChange={onFile} style={{ display: "none" }} />
              </label>
              {file && <span className="soft" style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}><Attach a={file} />{file.name}</span>}
              <button type="submit" className="btn primary" style={{ marginLeft: "auto" }}>{I.plus}Assign to class</button>
            </div>
          </form>
        </Card>
      )}

      <Card title={isTeacher ? "Assigned homework" : "Your homework"} pad={false}>
        <div className="card-pad" style={{ paddingBottom: 6 }}>
          <div className="list">
            {list.map((h, i) => {
              const c = subjectColor[h.subject] || "var(--muted)";
              return (
                <div key={h.id || i} className="list-row">
                  <span className="l-ic" style={{ background: `${c}18`, color: c }}><span style={{ display: "grid", placeItems: "center" }}>{I.book}</span></span>
                  <div className="l-main">
                    <div className="l-t">{h.title} {h.fresh && <Pill kind="accent">New</Pill>}</div>
                    <div className="l-s">{h.subject} · {h.cls} · due {h.due}{h.desc ? ` — ${h.desc}` : ""}</div>
                  </div>
                  <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {h.attach && <Attach a={h.attach} />}
                    {isTeacher && <Pill kind={h.status === "Graded" ? "good" : "info"}>{h.status}</Pill>}
                    {isStudent && (subs[h.id] ? <Pill kind="good" dot>Submitted</Pill> : <button className="btn primary" style={{ padding: "6px 12px" }} onClick={() => doSubmit(h.id)}>Submit</button>)}
                    {role === "parent" && <Pill kind={subs[h.id] ? "good" : "mute"}>{subs[h.id] ? "Submitted" : h.status || "Open"}</Pill>}
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

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0 };
