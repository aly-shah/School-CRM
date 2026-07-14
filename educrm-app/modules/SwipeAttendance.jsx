"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { getStudents, getTeacherSession, saveSwipeAttendance } from "@/lib/store";
import { firstClass } from "@/lib/classes";

const OUT = { P: "translateX(135%) rotate(16deg)", A: "translateX(-135%) rotate(-16deg)", L: "translateY(-135%) rotate(-4deg)" };
const TH = 95; // px threshold to count a swipe

const CallIcon = <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;

export default function SwipeAttendance() {
  const [grade, setGrade] = useState(null);
  const [deck, setDeck] = useState(null);
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState({});      // roll -> {status, name, phone}
  const [hist, setHist] = useState([]);         // rolls in order marked (for undo)
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [fly, setFly] = useState(null);         // 'P' | 'A' | 'L' while animating out
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
    setTimeout(() => { setI((x) => x + 1); setDrag({ x: 0, y: 0, active: false }); setFly(null); }, 270);
  };

  const undo = () => {
    if (!hist.length) return;
    const last = hist[hist.length - 1];
    setHist((h) => h.slice(0, -1));
    setMarks((m) => { const n = { ...m }; delete n[last]; return n; });
    setI((x) => Math.max(0, x - 1));
    setFly(null); setDrag({ x: 0, y: 0, active: false }); setSaved(false);
  };

  // ---- pointer drag on the top card ----
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
    const entries = Object.entries(marks).map(([roll, v]) => ({ roll, ...v }));
    await saveSwipeAttendance(grade, entries);
    setSaved(true);
  };

  if (!deck) return <div className="soft" style={{ padding: 20 }}>Loading class…</div>;
  if (deck.length === 0) return <div className="soft" style={{ padding: 20 }}>No students found for class {grade}.</div>;

  const counts = Object.values(marks).reduce((a, m) => { a[m.status] = (a[m.status] || 0) + 1; return a; }, {});

  return (
    <div className="swipe-wrap">
      <div className="swipe-progress">
        <span>{grade} · {Math.min(i, deck.length)}/{deck.length} marked</span>
        <div className="swipe-mini">
          <span className="good">{counts.P || 0} P</span>
          <span className="bad">{counts.A || 0} A</span>
          <span className="warn">{counts.L || 0} L</span>
        </div>
      </div>

      {!done ? (
        <>
          <div className="swipe-deck">
            {/* stacked peek cards behind */}
            {deck.slice(i + 1, i + 3).reverse().map((s, idx, arr) => {
              const depth = arr.length - idx; // 1 = closest behind
              return <div key={s.roll} className="swipe-card peek" style={{ transform: `scale(${1 - depth * 0.04}) translateY(${depth * 12}px)`, zIndex: 1 }} />;
            })}

            {/* top card */}
            {cur && (
              <div
                className="swipe-card top"
                onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
                style={{
                  zIndex: 5,
                  transform: fly ? OUT[fly] : `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x / 22}deg)`,
                  transition: drag.active ? "none" : "transform .27s cubic-bezier(.2,.7,.3,1)",
                  opacity: fly ? 0 : 1,
                }}
              >
                <Stamp show={drag.x > 30 && !fly} kind="good" x={drag.x} label="PRESENT" pos="left" />
                <Stamp show={drag.x < -30 && !fly} kind="bad" x={-drag.x} label="ABSENT" pos="right" />
                <Stamp show={drag.y < -30 && Math.abs(drag.y) > Math.abs(drag.x) && !fly} kind="warn" x={-drag.y} label="ON LEAVE" pos="top" />

                <div className="swipe-photo">
                  {cur.photo ? <img src={cur.photo} alt={cur.name} draggable="false" /> : <Avatar name={cur.name} size={128} radius fs={44} />}
                </div>
                <div className="swipe-body">
                  <div className="swipe-name">{cur.name}</div>
                  <div className="swipe-sub">Roll {cur.roll} · {cur.grade} · {cur.gender}</div>
                  <div className="swipe-info">
                    <Row k="Guardian" v={guardian(cur)?.name || "—"} />
                    <Row k="Contact" v={guardian(cur)?.phone || "—"} icon={CallIcon} />
                    <Row k="Attendance" v={`${cur.attendance ?? "—"}% term`} />
                    {cur.medical && <Row k="Medical" v={cur.medical} wrap />}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="swipe-hint">Swipe → present · ← absent · ↑ on leave</div>

          <div className="swipe-acts">
            <button className="swipe-btn bad" onClick={() => throwCard("A")} aria-label="Absent"><span>✕</span>Absent</button>
            <button className="swipe-btn warn" onClick={() => throwCard("L")} aria-label="On leave"><span>↑</span>Leave</button>
            <button className="swipe-btn good" onClick={() => throwCard("P")} aria-label="Present"><span>✓</span>Present</button>
          </div>
          <button className="btn" onClick={undo} disabled={!hist.length} style={{ margin: "14px auto 0", display: "flex" }}>↩ Undo last</button>
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

function Stamp({ show, kind, x, label, pos }) {
  if (!show) return null;
  const rot = pos === "left" ? -14 : pos === "right" ? 14 : 0;
  const p = pos === "left" ? { left: 16 } : pos === "right" ? { right: 16 } : { left: "50%", transform: "translateX(-50%)" };
  return (
    <span className="swipe-stamp" style={{ top: pos === "top" ? "auto" : 18, bottom: pos === "top" ? 24 : "auto", ...p, color: `var(--${kind})`, borderColor: `var(--${kind})`, opacity: Math.min(1, x / 90), transform: `${p.transform || ""} rotate(${rot}deg)` }}>
      {label}
    </span>
  );
}
function Row({ k, v, icon, wrap }) {
  return (
    <div className="swipe-row">
      <span className="k">{k}</span>
      <span className="v" style={wrap ? { whiteSpace: "normal", textAlign: "right" } : {}}>{icon && <span style={{ display: "inline-flex", verticalAlign: "-2px", marginRight: 5, color: "var(--muted)" }}>{icon}</span>}{v}</span>
    </div>
  );
}
function Tot({ n, label, kind }) {
  return (
    <div className="swipe-tot">
      <div className="n" style={{ color: `var(--${kind})` }}>{n}</div>
      <div className="l">{label}</div>
    </div>
  );
}
