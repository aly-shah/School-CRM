"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatTile, Card, Pill, Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { getTeachers, addTeacher, setTeacherPassword, removeTeacher } from "@/lib/store";

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0, boxSizing: "border-box" };
const blank = { name: "", username: "", password: "", subject: "", classes: "", phone: "" };

export default function TeacherManagement() {
  const [list, setList] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blank);
  const [photo, setPhoto] = useState(null);
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(null);
  const [resetId, setResetId] = useState(null);   // teacher id being reset
  const [resetPw, setResetPw] = useState("");

  useEffect(() => { getTeachers().then(setList); }, []);

  const saveReset = async (t) => {
    if (!resetPw.trim()) return;
    await setTeacherPassword(t.id, resetPw.trim());
    setCreated({ username: t.username, password: resetPw.trim() });
    setResetId(null); setResetPw("");
  };
  const remove = async (t) => {
    if (!window.confirm(`Remove ${t.name}? Their login will stop working.`)) return;
    await removeTeacher(t.id);
    setList(await getTeachers());
  };

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };

  const create = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.password) { setErr("Name, username and password are required."); return; }
    try { await addTeacher({ ...form, photo }); }
    catch (e) { setErr(String(e.message || e)); return; }
    setCreated({ username: form.username.trim().toLowerCase(), password: form.password });
    setList(await getTeachers());
    setForm(blank); setPhoto(null); setErr(""); setAdding(false);
  };

  return (
    <>
      <PageHeader title="Teachers" subtitle="Create each teacher's login and profile — they get their own portal">
        <button className="btn primary" onClick={() => { setAdding((a) => !a); setCreated(null); }}><span style={{ display: "flex" }}>{I.plus}</span>Add teacher</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Teachers" icon={I.staff} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={list.length} sub="with accounts" />
        <StatTile label="Active" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={list.filter((t) => t.status === "Active").length} sub="can log in" />
        <StatTile label="Subjects" icon={I.book} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={new Set(list.map((t) => t.subject).filter(Boolean)).size} sub="taught" />
        <StatTile label="Portal" icon={I.home} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="/teacher" sub="teacher login" />
      </div>

      {created && (
        <Card style={{ marginBottom: 20, borderColor: "var(--good)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="pill good"><span className="d" />Login ready</span>
            <span className="soft" style={{ fontSize: 13.5 }}>Share these with the teacher — login at <b>/teacher</b>: username <b>{created.username}</b> · password <b>{created.password}</b></span>
          </div>
        </Card>
      )}

      {adding && (
        <Card title="Add a teacher" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <label style={{ cursor: "pointer", flex: "0 0 auto", textAlign: "center" }}>
              {photo
                ? <img src={photo} alt="" style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 16, border: "1px solid var(--line)" }} />
                : <div style={{ width: 92, height: 92, borderRadius: 16, background: "var(--panel-2)", border: "1px dashed var(--line)", display: "grid", placeItems: "center", color: "var(--muted)" }}><span style={{ display: "grid", placeItems: "center", width: 22, height: 22 }}>{I.image}</span></div>}
              <div style={{ fontSize: 11.5, color: "var(--accent)", marginTop: 6, fontWeight: 600 }}>{photo ? "Change photo" : "Add photo"}</div>
              <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
            </label>
            <div style={{ flex: "1 1 320px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={inp} />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject — e.g. Mathematics" style={inp} />
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username (for login)" style={inp} />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" style={inp} />
              <input value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} placeholder="Classes — e.g. 6-B, 8-A" style={inp} />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" style={inp} />
            </div>
          </div>
          {err && <div style={{ color: "var(--bad)", fontSize: 12.5, marginTop: 12 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn" onClick={() => { setAdding(false); setErr(""); }}>Cancel</button>
            <button className="btn primary" onClick={create} style={{ marginLeft: "auto" }}>{I.check}Create account</button>
          </div>
        </Card>
      )}

      <div className="grid g-3">
        {list.map((t) => (
          <div key={t.id} className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {t.photo
                ? <img src={t.photo} alt={t.name} style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", flex: "0 0 auto" }} />
                : <Avatar name={t.name} size={52} radius fs={19} />}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>{t.name}</div>
                <div className="soft" style={{ fontSize: 12.5 }}>{t.subject || "Teacher"}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
              <Row k="Username" v={t.username} />
              <Row k="Classes" v={t.classes || "—"} />
              <Row k="Phone" v={t.phone || "—"} />
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Pill kind={t.status === "Active" ? "good" : "mute"} dot>{t.status}</Pill>
              <button className="btn" style={{ padding: "5px 10px", fontSize: 12, marginLeft: "auto" }} onClick={() => { setResetId(resetId === t.id ? null : t.id); setResetPw(""); }}>{I.lock}Reset password</button>
              <button className="btn" style={{ padding: "5px 10px", fontSize: 12, color: "var(--bad)", borderColor: "var(--bad)" }} onClick={() => remove(t)}>Remove</button>
            </div>
            {resetId === t.id && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input value={resetPw} onChange={(e) => setResetPw(e.target.value)} placeholder="New password" style={{ ...inp, flex: 1 }} onKeyDown={(e) => e.key === "Enter" && saveReset(t)} autoFocus />
                <button className="btn primary" style={{ padding: "6px 12px" }} onClick={() => saveReset(t)}>Save</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <span className="muted">{k}</span>
      <span className="tnum" style={{ fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
    </div>
  );
}
