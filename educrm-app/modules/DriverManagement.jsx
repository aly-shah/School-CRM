"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatTile, Card, Pill, Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { getDrivers, addDriver, getVehicleChecks } from "@/lib/store";

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0, boxSizing: "border-box" };
const blank = { name: "", cnic: "", phone: "", license_no: "", route: "", bus: "" };

export default function DriverManagement() {
  const [list, setList] = useState([]);
  const [checks, setChecks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blank);
  const [photo, setPhoto] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => { getDrivers().then(setList); getVehicleChecks().then(setChecks); }, []);
  const checkFor = (bus) => checks.find((c) => c.bus === bus);

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(f);
  };

  const create = async () => {
    if (!form.name.trim()) { setErr("Driver name is required."); return; }
    if (form.cnic && !/^\d{5}-\d{7}-\d$/.test(form.cnic.trim())) { setErr("CNIC must look like 35201-1234567-1."); return; }
    try { await addDriver({ ...form, photo }); }
    catch (e) { setErr(String(e.message || e)); return; }
    setList(await getDrivers());
    setForm(blank); setPhoto(null); setErr(""); setAdding(false);
  };

  return (
    <>
      <PageHeader title="Transport — Drivers" subtitle="Register drivers, assign routes and manage the fleet">
        <button className="btn primary" onClick={() => setAdding((a) => !a)}><span style={{ display: "flex" }}>{I.plus}</span>Register driver</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Drivers" icon={I.students} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={list.length} sub="registered" />
        <StatTile label="Active" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={list.filter((d) => d.status === "Active").length} sub="on duty" />
        <StatTile label="Routes" icon={I.route} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={new Set(list.map((d) => d.route).filter(Boolean)).size} sub="assigned" />
        <StatTile label="Buses" icon={I.bus} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={new Set(list.map((d) => d.bus).filter(Boolean)).size} sub="in fleet" />
      </div>

      {adding && (
        <Card title="Register a new driver" style={{ marginBottom: 20 }}>
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
              <input value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} placeholder="CNIC — 35201-1234567-1" style={inp} />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone — +92 3xx xxxxxxx" style={inp} />
              <input value={form.license_no} onChange={(e) => setForm({ ...form, license_no: e.target.value })} placeholder="Licence no." style={inp} />
              <input value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} placeholder="Route — e.g. Route 2 · East" style={inp} />
              <input value={form.bus} onChange={(e) => setForm({ ...form, bus: e.target.value })} placeholder="Bus reg. — e.g. LEB-4471" style={inp} />
            </div>
          </div>
          {err && <div style={{ color: "var(--bad)", fontSize: 12.5, marginTop: 12 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn" onClick={() => { setAdding(false); setErr(""); }}>Cancel</button>
            <button className="btn primary" onClick={create} style={{ marginLeft: "auto" }}>{I.check}Register driver</button>
          </div>
        </Card>
      )}

      <div className="grid g-3">
        {list.map((d) => (
          <div key={d.id} className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              {d.photo
                ? <img src={d.photo} alt={d.name} style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", flex: "0 0 auto" }} />
                : <Avatar name={d.name} size={52} radius fs={19} />}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700 }}>{d.name}</div>
                <div className="soft" style={{ fontSize: 12.5 }}>{d.route || "No route assigned"}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5 }}>
              <Row k="CNIC" v={d.cnic || "—"} />
              <Row k="Phone" v={d.phone || "—"} />
              <Row k="Licence" v={d.license_no || "—"} />
              <Row k="Bus" v={d.bus || "—"} />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Pill kind={d.status === "Active" ? "good" : "mute"} dot>{d.status}</Pill>
              {(() => {
                const c = checkFor(d.bus);
                if (!c) return <Pill kind="mute">No inspection</Pill>;
                return <Pill kind={c.status === "Pass" ? "good" : "bad"} dot>Vehicle: {c.status}</Pill>;
              })()}
            </div>
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
