"use client";
import { useEffect, useRef, useState } from "react";
import { I } from "@/components/icons";
import { getStudents, getTeacherSession, saveSwipeAttendance } from "@/lib/store";
import { firstClass } from "@/lib/classes";

const OUT = { P: "translate(135%,-6%) rotate(20deg)", A: "translate(-135%,-6%) rotate(-20deg)", L: "translateY(-135%) rotate(-4deg)" };
const TH = 95; // px threshold to count a swipe

const initials = (n) => n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
// stable warm/cool gradient per student for the photo-less fallback
const grad = (n) => {
  let h = 0; for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 360;
  return `linear-gradient(150deg, hsl(${h} 62% 52%), hsl(${(h + 40) % 360} 64% 38%))`;
};

export default function SwipeAttendance() {
  const [grade, setGrade] = useState(null);
  const [deck, setDeck] = useState(null);
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState({});
  const [hist, setHist] = useState([]);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [fly, setFly] = useState(null);
  const [saved, setSaved] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const g = firstClass(getTeacherSession()?.classes);
    setGrade(g);
    getStudents().then((all) => setDeck(all.filter((s) => s.grade === g).sort((a, b) => a.roll - b.roll)));
  }, []);

  const cur = deck?.[i];
  const done = deck && i >= deck.length;
  const guardian = (s) => s.parent || s.father || null;

  const throwCard = (status) => {
    if (!cur || fly) return;
    const g = guardian(cur);
    setMarks((m) => ({ ...m, [cur.roll]: { status, name: cur.name, phone: g?.phone || null } }));
    setHist((h) => [...h, cur.roll]);
    setFly(status);
    setTimeout(() => { setI((x) => x + 1); setDrag({ x: 0, y: 0, active: false }); setFly(null); }, 280);
  };

  const undo = () => {
    if (!hist.length) return;
    const last = hist[hist.length - 1];
    setHist((h) => h.slice(0, -1));
    setMarks((m) => { const n = { ...m }; delete n[last]; return n; });
    setI((x) => Math.max(0, x - 1));
    setFly(null); setDrag({ x: 0, y: 0, active: false }); setSaved(false);
  };

  const onDown = (e) => { if (fly) return; start.current = { x: e.clientX, y: e.clientY }; setDrag({ x: 0, y: 0, active: true }); e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (!drag.active) return; setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true }); };
  const onUp = () => {
    if (!drag.active) return;
    const { x, y } = drag;
    if (y < -TH && Math.abs(y) > Math.abs(x)) throwCard("L");
    else if (x > TH) throwCard("P");
    else if (x < -TH) throwCard("A");
    else setDrag({ x: 0, y: 0, active: false });
  };

  const save = async () => {
    await saveSwipeAttendance(grade, Object.entries(marks).map(([roll, v]) => ({ roll, ...v })));
    setSaved(true);
  };

  if (!deck) return <div className="soft" style={{ padding: 20 }}>Loading class…</div>;
  if (deck.length === 0) return <div className="soft" style={{ padding: 20 }}>No students found for class {grade}.</div>;

  const counts = Object.values(marks).reduce((a, m) => { a[m.status] = (a[m.status] || 0) + 1; return a; }, {});

  return (
    <div className="swipe-wrap">
      <div className="swipe-progress">
        <span>{grade} · {Math.min(i, deck.length)}/{deck.length} marked</span>
        <div className="swipe-mini"><span className="good">{counts.P || 0} P</span><span className="bad">{counts.A || 0} A</span><span className="warn">{counts.L || 0} L</span></div>
      </div>

      {!done ? (
        <>
          <div className="swipe-deck">
            {deck.slice(i + 1, i + 3).reverse().map((s, idx, arr) => {
              const depth = arr.length - idx;
              return <div key={s.roll} className="swipe-card peek" style={{ transform: `scale(${1 - depth * 0.045}) translateY(${depth * 14}px)`, zIndex: 1 }} />;
            })}

            {cur && (
              <div
                className="swipe-card top"
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
                style={{
                  zIndex: 5,
                  transform: fly ? OUT[fly] : `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`,
                  transition: drag.active ? "none" : "transform .28s cubic-bezier(.2,.7,.3,1)",
                }}
              >
                {/* full-bleed photo (or gradient + initials) */}
                {cur.photo
                  ? <img className="swipe-img" src={cur.photo} alt={cur.name} draggable="false" />
                  : <div className="swipe-img fallback" style={{ background: grad(cur.name) }}><span className="swipe-initials">{initials(cur.name)}</span></div>}
                <div className="swipe-scrim" />

                {/* drag stamps */}
                <span className="swipe-stamp good" style={{ top: 22, left: 20, transform: "rotate(-18deg)", opacity: Math.min(1, Math.max(0, drag.x) / 90) }}>PRESENT</span>
                <span className="swipe-stamp bad" style={{ top: 22, right: 20, transform: "rotate(18deg)", opacity: Math.min(1, Math.max(0, -drag.x) / 90) }}>ABSENT</span>
                <span className="swipe-stamp warn" style={{ bottom: 150, left: "50%", transform: "translateX(-50%) rotate(-6deg)", opacity: Math.min(1, Math.max(0, -drag.y - Math.abs(drag.x)) / 80) }}>ON&nbsp;LEAVE</span>

                {/* info overlaid on the photo */}
                <div className="swipe-overlay">
                  <div className="swipe-name">{cur.name}<span className="roll">#{cur.roll}</span></div>
                  <div className="swipe-meta">{cur.grade} · {cur.gender} · {cur.attendance ?? "—"}% attendance</div>
                  <div className="swipe-chips">
                    {guardian(cur)?.name && <span className="swipe-chip">{ICON_USER}{guardian(cur).name}</span>}
                    {guardian(cur)?.phone && <span className="swipe-chip">{ICON_PHONE}{guardian(cur).phone}</span>}
                    {cur.medical && <span className="swipe-chip warn">{ICON_MED}Medical note</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="swipe-hint">Swipe → present · ← absent · ↑ on leave</div>

          <div className="swipe-acts">
            <button className="tinder-btn undo" onClick={undo} disabled={!hist.length} aria-label="Undo">↩</button>
            <button className="tinder-btn nope" onClick={() => throwCard("A")} aria-label="Absent">✕</button>
            <button className="tinder-btn leave" onClick={() => throwCard("L")} aria-label="On leave">↑</button>
            <button className="tinder-btn like" onClick={() => throwCard("P")} aria-label="Present">✓</button>
          </div>
          <div className="swipe-legend"><span className="bad">Absent</span><span className="warn">Leave</span><span className="good">Present</span></div>
        </>
      ) : (
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>✅</div>
          <h3 style={{ margin: "0 0 4px" }}>All {deck.length} students marked</h3>
          <div className="soft" style={{ fontSize: 13, marginBottom: 16 }}>{grade} · today</div>
          <div className="swipe-summary">
            <Tot n={counts.P || 0} label="Present" kind="good" />
            <Tot n={counts.A || 0} label="Absent" kind="bad" />
            <Tot n={counts.L || 0} label="On leave" kind="warn" />
          </div>
          {saved
            ? <div className="pill good" style={{ margin: "18px auto 0", width: "fit-content" }}><span className="d" />Saved · parents of absentees alerted</div>
            : <button className="btn primary" onClick={save} style={{ margin: "18px auto 0", display: "flex" }}>{I.check}Save attendance & alert parents</button>}
          <button className="btn" onClick={undo} disabled={!hist.length} style={{ margin: "10px auto 0", display: "flex" }}>↩ Undo last</button>
        </div>
      )}
    </div>
  );
}

const ICON_USER = <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" /></svg>;
const ICON_PHONE = <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
const ICON_MED = <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>;

function Tot({ n, label, kind }) {
  return <div className="swipe-tot"><div className="n" style={{ color: `var(--${kind})` }}>{n}</div><div className="l">{label}</div></div>;
}
