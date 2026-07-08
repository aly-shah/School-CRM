"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Donut, Pill, gradeClass } from "@/components/ui";
import { I } from "@/components/icons";
import { pkr } from "@/lib/data";
import { getStudent, setPhoto } from "@/lib/store";
import ParentAccess from "@/components/ParentAccess";
import IDCard from "@/modules/IDCard";

export default function StudentProfile({ id, base = "/admin" }) {
  const [s, setS] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("overview");
  const [photo, setPhotoState] = useState(null);

  useEffect(() => {
    getStudent(id).then((found) => {
      const st = found && found.id ? found : null;
      setS(st);
      setPhotoState(st?.photo || null);
      setReady(true);
    });
  }, [id]);

  const onPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f || !s) return;
    const r = new FileReader();
    r.onload = () => { setPhotoState(r.result); setPhoto(s.id, r.result); };
    r.readAsDataURL(f);
  };

  if (!ready) return null;
  if (!s) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p className="soft">Student not found.</p>
      <div style={{ marginTop: 12 }}><Link href={`${base}/students`} className="btn">&larr; All students</Link></div>
    </div>
  );

  const fees = s.fees || { annual: 180000, due: s.feeDue || 0, paid: 180000 - (s.feeDue || 0) };
  const collectedPct = Math.round((fees.paid / fees.annual) * 100);
  const subjects = s.subjects || [];
  const total = subjects.reduce((a, b) => a + b.mark, 0);
  const present = Math.round((180 * s.attendance) / 100);
  const late = s.attendance > 90 ? 2 : 4;
  const absent = 180 - present - late;
  const parent = s.parent || { name: "Parent / Guardian", rel: "—", phone: "+92 300 0000000", email: "—" };

  return (
    <>
      <div style={{ marginBottom: 16 }} className="no-print">
        <Link href={`${base}/students`} className="soft" style={{ fontSize: 13 }}>&larr; All students</Link>
      </div>

      <div className="prof-layout">
        <div className="rail no-print">
          <div className="card prof">
            <div className="prof-av-wrap">
              {photo
                ? <img src={photo} alt={s.name} className="prof-av" style={{ objectFit: "cover" }} />
                : <div className="prof-av">{initials(s.name)}</div>}
              <label className="prof-av-edit" title="Upload photo">
                {I.image}
                <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
              </label>
            </div>
            <h2>{s.name}</h2>
            <div className="role">Grade {s.grade} · Roll No. {s.roll}</div>
            <div style={{ marginTop: 9, display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              <Pill kind={s.status === "Active" ? "good" : "mute"} dot>{s.status}</Pill>
              <Pill kind="info">Present today</Pill>
            </div>
            <div className="idmeta">
              <div><div className="k">Admission #</div><div className="v tnum">{s.id}</div></div>
              <div><div className="k">Gender</div><div className="v">{s.gender}</div></div>
              <div><div className="k">Date of birth</div><div className="v tnum">{s.dob || "—"}</div></div>
              <div><div className="k">Blood group</div><div className="v">{s.blood || "—"}</div></div>
              <div><div className="k">House</div><div className="v">{s.house || "—"}</div></div>
              <div><div className="k">Class rank</div><div className="v tnum">{s.rank} / 32</div></div>
            </div>
            <div className="prof-acts">
              <button className="btn primary">{I.msg}Message</button>
              <button className="btn">{I.fees}Collect fee</button>
              <button className="btn sq" aria-label="Edit">{I.edit}</button>
            </div>
          </div>

          <div className="card">
            <div className="card-h"><h3>Family &amp; contact</h3></div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><div className="k2">Parent / Guardian</div><div className="v2">{parent.name}<small>{parent.rel} · primary contact</small></div></div>
              <div><div className="k2">Phone / WhatsApp</div><div className="v2 tnum">{parent.phone}</div></div>
              <div><div className="k2">Email</div><div className="v2">{parent.email}</div></div>
              <div><div className="k2">Address</div><div className="v2" style={{ fontWeight: 500 }}>{s.address || "On file"}</div></div>
            </div>
          </div>

          <ParentAccess roll={s.roll} name={s.name} />
        </div>

        <div className="colmain">
          <div className="tabs no-print">
            {[["overview", "Overview"], ["card", "ID Card"]].map(([k, l]) => (
              <a key={k} href="#" onClick={(e) => { e.preventDefault(); setTab(k); }} className={tab === k ? "active" : ""}>{l}</a>
            ))}
          </div>

          {tab === "card" && <IDCard s={s} photo={photo} />}

          {tab === "overview" && (
            <>
              <div className="tiles">
                <div className="tile"><div className="lab">Attendance</div><div className="big tnum">{s.attendance}%</div><div className="sub">This term · 180 days</div></div>
                <div className="tile"><div className="lab">Fees due</div><div className="big tnum">{fees.due ? pkr(fees.due) : "—"}</div><div className="sub">{fees.due ? <Pill kind="warn" dot>Pending</Pill> : <Pill kind="good" dot>Cleared</Pill>}</div></div>
                <div className="tile"><div className="lab">Class rank</div><div className="big tnum">{s.rank} <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 600 }}>/ 32</span></div><div className="sub">Grade {s.grade}</div></div>
                <div className="tile"><div className="lab">Overall</div><div className="big tnum">{s.overall}% <span className={`pill ${gradeClass(s.grade_letter)}`} style={{ fontSize: 12, verticalAlign: "middle" }}>{s.grade_letter}</span></div><div className="sub">{subjects.length ? `${total} / 500 marks` : "Term 2"}</div></div>
              </div>

              <div className="grid g-2" style={{ marginTop: 20 }}>
                <div className="card">
                  <div className="card-h"><h3>Academic performance · Term 2</h3><a className="link" href="#">Report card</a></div>
                  <div className="card-pad">
                    {subjects.length ? (
                      <>
                        {subjects.map((sub) => (
                          <div key={sub.name} className="subj">
                            <span className="s-nm">{sub.name}</span>
                            <div className="bar-el" style={{ flex: 1 }}><i style={{ width: `${sub.mark}%`, background: sub.grade.startsWith("B") ? "var(--info)" : "var(--accent)" }} /></div>
                            <span className="s-mk tnum">{sub.mark}</span>
                            <span className={`pill ${gradeClass(sub.grade)}`} style={{ width: 38, justifyContent: "center" }}>{sub.grade}</span>
                          </div>
                        ))}
                        <div className="subj-foot"><span className="muted" style={{ fontSize: 12 }}>Total · {subjects.length} subjects</span><span className="tnum" style={{ fontWeight: 700 }}>{total} / 500 · {s.overall}%</span></div>
                      </>
                    ) : (
                      <div className="soft">Overall <b>{s.overall}%</b> (Grade {s.grade_letter}) · rank {s.rank}. Subject breakdown available after Term 2 marks entry.</div>
                    )}
                  </div>
                </div>

                <div className="card">
                  <div className="card-h"><h3>Attendance</h3><a className="link" href="#">View log</a></div>
                  <div className="card-pad">
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <Donut pct={s.attendance} color="var(--good)" label="Present" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                        <Legend color="var(--good)" label="Present" val={present} />
                        <Legend color="var(--warn)" label="Late" val={late} />
                        <Legend color="var(--bad)" label="Absent" val={absent} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid g-2" style={{ marginTop: 20 }}>
                <div className="card">
                  <div className="card-h"><h3>Fees · 2025–26</h3><a className="link" href="#">Full ledger</a></div>
                  <div className="card-pad">
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 8 }}>
                      <Donut pct={collectedPct} label="Collected" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                        <Legend color="var(--accent)" label="Paid" val={pkr(fees.paid)} />
                        <Legend color="var(--line)" label="Due" val={pkr(fees.due)} />
                        <Legend color="transparent" label="Annual fee" val={pkr(fees.annual)} muted />
                      </div>
                    </div>
                    {fees.due > 0 && <button className="btn primary" style={{ width: "100%", marginTop: 8 }}>{I.fees}Collect {pkr(fees.due)}</button>}
                  </div>
                </div>

                <div className="card">
                  <div className="card-h"><h3>Family, medical &amp; emergency</h3></div>
                  <div className="card-pad">
                    <div className="fam">
                      {s.father && <div className="fam-b"><div className="k2">Father</div><div className="v2">{s.father.name}<small>{s.father.occ} · {s.father.phone}</small></div></div>}
                      <div className="fam-b"><div className="k2">{parent.rel || "Parent"}</div><div className="v2">{parent.name}<small>{parent.phone}</small></div></div>
                      {s.sibling && <div className="fam-b"><div className="k2">Sibling</div><div className="v2">{s.sibling}</div></div>}
                      <div className="fam-b"><div className="k2">Emergency</div><div className="v2">{parent.name}<small>Primary contact</small></div></div>
                      <div className="fam-b full" style={{ background: "var(--warn-bg)", border: "none" }}>
                        <div className="k2" style={{ color: "var(--warn)" }}>Medical note</div>
                        <div className="v2" style={{ fontWeight: 500 }}>{s.medical || "No medical conditions on record."}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Legend({ color, label, val, muted }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: muted ? "var(--muted)" : "inherit" }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color, flex: "0 0 auto" }} />
      {label}
      <span className="tnum" style={{ marginLeft: "auto", fontWeight: 700, color: muted ? "var(--ink)" : "inherit" }}>{val}</span>
    </div>
  );
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}
