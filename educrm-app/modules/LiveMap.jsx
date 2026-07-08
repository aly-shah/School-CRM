"use client";
import { useEffect, useState } from "react";
import { Pill } from "@/components/ui";

// ---- static geometry (a stylised city map) ----
const ROADS_X = [15, 140, 270, 400, 530, 660, 785];
const ROADS_Y = [15, 130, 250, 370, 490];

const PATH = [
  { x: 140, y: 490, stop: "Rose Villa", time: "6:55" },
  { x: 400, y: 490, stop: "Green Court", time: "6:58" },
  { x: 400, y: 370 },
  { x: 660, y: 370, stop: "Mall Road", time: "7:05" },
  { x: 660, y: 130, stop: "Park Lane", time: "7:09" },
  { x: 400, y: 130, stop: "Civic Centre", time: "7:16" },
  { x: 270, y: 130, stop: "Lake View", time: "7:20" },
  { x: 140, y: 130, stop: "School", time: "7:45", dest: true },
];

const cum = [0];
let total = 0;
for (let i = 1; i < PATH.length; i++) {
  total += Math.hypot(PATH[i].x - PATH[i - 1].x, PATH[i].y - PATH[i - 1].y);
  cum.push(total);
}
const routeD = "M " + PATH.map((p) => `${p.x} ${p.y}`).join(" L ");
const STOPS = PATH.map((p, i) => ({ ...p, cum: cum[i] })).filter((p) => p.stop);

function pointAt(d) {
  if (d <= 0) return PATH[0];
  if (d >= total) return PATH[PATH.length - 1];
  for (let i = 1; i < PATH.length; i++) {
    if (d <= cum[i]) {
      const f = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
      return { x: PATH[i - 1].x + (PATH[i].x - PATH[i - 1].x) * f, y: PATH[i - 1].y + (PATH[i].y - PATH[i - 1].y) * f };
    }
  }
  return PATH[PATH.length - 1];
}

const BLOCKS = [];
for (let i = 0; i < ROADS_X.length - 1; i++)
  for (let j = 0; j < ROADS_Y.length - 1; j++)
    BLOCKS.push({
      key: `${i}-${j}`,
      x: ROADS_X[i] + 10, y: ROADS_Y[j] + 10,
      w: ROADS_X[i + 1] - ROADS_X[i] - 20, h: ROADS_Y[j + 1] - ROADS_Y[j] - 20,
    });
const PARK = "1-1";
const WATER = ["4-2", "5-2"];

export default function LiveMap({ showList = true, highlightStop }) {
  const [t, setT] = useState(0.02);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setT(0.42); return; }
    let raf, start, last = 0;
    const loop = (ts) => {
      if (start === undefined) start = ts;
      const nt = ((ts - start) / 34000) % 1; // ~34s per full route
      if (ts - last > 66) { setT(nt); last = ts; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const d = t * total;
  const bus = pointAt(d);
  const tripMin = 50;
  const remaining = Math.max(1, Math.round((1 - t) * tripMin));
  const progress = Math.round(t * 100);
  const speed = Math.round(30 + 6 * Math.sin(t * 14));
  const nextStop = STOPS.find((s) => s.cum > d + 1) || STOPS[STOPS.length - 1];
  const pickedCount = STOPS.filter((s) => !s.dest && s.cum <= d).length;

  return (
    <>
      <div className="map-wrap">
        <svg viewBox="0 0 800 505" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Live bus route map">
          <rect x="0" y="0" width="800" height="505" fill="#dfe4ea" />
          {BLOCKS.map((b) => {
            const fill = b.key === PARK ? "#d5ecd8" : WATER.includes(b.key) ? "#cfe3f3" : "#f1f4f8";
            return <rect key={b.key} x={b.x} y={b.y} width={b.w} height={b.h} rx="5" fill={fill} />;
          })}
          <text x="205" y="200" fontSize="11" fill="#5a8a63" fontWeight="600" style={{ paintOrder: "stroke", stroke: "#d5ecd8", strokeWidth: 2 }}>Central Park</text>
          <text x="600" y="315" fontSize="11" fill="#4f83aa" fontWeight="600" style={{ paintOrder: "stroke", stroke: "#cfe3f3", strokeWidth: 2 }}>Lake</text>

          {/* route: base + travelled overlay */}
          <path d={routeD} fill="none" stroke="#c3c9d2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d={routeD} fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={`${d} ${total}`} />

          {/* stops */}
          {STOPS.map((s, i) => {
            const passed = !s.dest && s.cum <= d;
            const isNext = s === nextStop;
            const hi = highlightStop && s.stop === highlightStop;
            const fill = passed ? "var(--good)" : isNext ? "var(--accent)" : "#ffffff";
            const stroke = s.dest ? "var(--accent)" : passed ? "var(--good)" : isNext ? "var(--accent)" : "#aeb4be";
            return (
              <g key={i}>
                {hi && <circle cx={s.x} cy={s.y} r="12" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5" />}
                {s.dest
                  ? <rect x={s.x - 6} y={s.y - 6} width="12" height="12" rx="3" fill="#fff" stroke="var(--accent)" strokeWidth="2.4" />
                  : <circle cx={s.x} cy={s.y} r="6.5" fill={fill} stroke={stroke} strokeWidth="2.4" />}
                <text x={s.x} y={s.y - 12} textAnchor="middle" fontSize="10.5" fontWeight="600"
                  fill={hi ? "var(--accent)" : "#2a2f3c"} style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}>
                  {hi ? `${s.stop} · your stop` : s.stop}
                </text>
              </g>
            );
          })}

          {/* bus */}
          <g transform={`translate(${bus.x}, ${bus.y})`}>
            <circle r="10" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="9;24" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
            <g stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round">
              <rect x="-5.5" y="-5" width="11" height="8.5" rx="2" />
              <path d="M-5.5 -1 H5.5" />
              <circle cx="-2.6" cy="4.6" r="1.2" fill="#fff" stroke="none" />
              <circle cx="2.6" cy="4.6" r="1.2" fill="#fff" stroke="none" />
            </g>
          </g>
        </svg>

        <div className="live-badge"><span className="d" />LIVE</div>
        <div className="map-legend">
          <span><i style={{ background: "var(--accent)" }} />Bus</span>
          <span><i style={{ background: "var(--good)" }} />Picked up</span>
          <span><i style={{ background: "#fff", border: "1.5px solid #aeb4be" }} />Upcoming</span>
        </div>
      </div>

      <div className="map-stats">
        <div className="map-stat"><div className="k">Next stop</div><div className="v" style={{ fontSize: 15 }}>{nextStop.stop}</div></div>
        <div className="map-stat"><div className="k">ETA to school</div><div className="v tnum">{remaining} min</div></div>
        <div className="map-stat"><div className="k">Speed</div><div className="v tnum">{speed} km/h</div></div>
        <div className="map-stat"><div className="k">Picked up</div><div className="v tnum">{pickedCount} / {STOPS.length - 1}</div></div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="bar-el" style={{ height: 8 }}><i style={{ width: `${progress}%` }} /></div>
        <div className="soft" style={{ fontSize: 12, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
          <span>Route progress</span><span className="tnum">{progress}%</span>
        </div>
      </div>

      {showList && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-h"><h3>Stops</h3><Pill kind="good" dot>On schedule</Pill></div>
          <div className="card-pad" style={{ paddingTop: 4, paddingBottom: 6 }}>
            <div className="list">
              {STOPS.map((s, i) => {
                const passed = !s.dest && s.cum <= d;
                const isNext = s === nextStop;
                return (
                  <div key={i} className="list-row">
                    <span className="l-ic" style={{ background: passed ? "var(--good-bg)" : isNext ? "var(--accent-weak)" : "var(--line-soft)", color: passed ? "var(--good)" : isNext ? "var(--accent)" : "var(--muted)" }}>
                      <span style={{ display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    </span>
                    <div className="l-main"><div className="l-t">{s.stop}</div><div className="l-s">Scheduled {s.time}</div></div>
                    <div className="l-end">
                      {passed ? <Pill kind="good" dot>Done</Pill> : isNext ? <Pill kind="accent">Next</Pill> : <Pill kind="mute">Upcoming</Pill>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
