"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { getStudents, getCertificates, addCertificate } from "@/lib/store";
import Certificate from "@/modules/Certificate";

const TYPES = ["Achievement", "Academic Excellence", "Merit", "Sports", "Perfect Attendance", "Participation", "Good Behaviour"];
const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", width: "100%", boxSizing: "border-box" };

export default function Certificates() {
  const [students, setStudents] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ studentId: "", type: "Achievement", title: "", desc: "" });
  const [preview, setPreview] = useState(null);

  useEffect(() => { getStudents().then(setStudents); getCertificates().then(setList); }, []);

  const issue = async () => {
    const st = students.find((s) => s.id === form.studentId);
    if (!st || !form.title.trim()) return;
    const c = {
      roll: st.roll, student: st.name, title: form.title.trim(), type: form.type, desc: form.desc.trim(),
      issuedBy: "Sadia Karim", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    };
    await addCertificate(c);
    setPreview(c);
    setList(await getCertificates());
    setForm({ studentId: "", type: form.type, title: "", desc: "" });
  };

  return (
    <>
      <PageHeader title="Certificates" subtitle="Award certificates — the student & parent are notified instantly" />

      <div className="grid g-2">
        <Card title="Issue a certificate">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} style={inp}>
              <option value="">Select student…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.grade}</option>)}
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inp}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title — e.g. Top of the class in Mathematics" style={inp} />
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Short citation (optional)" rows={2} style={{ ...inp, resize: "vertical" }} />
            <button className="btn primary" onClick={issue}>{I.award}Award certificate</button>
          </div>
        </Card>

        <Card title="Recently awarded" pad={false}>
          <div className="card-pad">
            <div className="list">
              {list.length === 0 && <div className="soft" style={{ fontSize: 13 }}>No certificates issued yet.</div>}
              {list.map((c) => (
                <div key={c.id} className="list-row">
                  <span className="l-ic" style={{ background: "var(--warn-bg)", color: "var(--warn)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.award}</span></span>
                  <div className="l-main"><div className="l-t">{c.title}</div><div className="l-s">{c.student} · {c.type}</div></div>
                  <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="muted" style={{ fontSize: 12 }}>{c.date}</span>
                    <button className="btn" style={{ padding: "6px 12px" }} onClick={() => setPreview(c)}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {preview && <div style={{ marginTop: 20 }}><Certificate cert={preview} showPrint /></div>}
    </>
  );
}
