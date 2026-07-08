"use client";
import { useState } from "react";
import { PageHeader, StatTile, Card, Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { manifest } from "@/lib/data";

export default function Manifest() {
  const [list, setList] = useState(manifest.map((m) => ({ ...m })));
  const mark = (i, status) => setList((l) => l.map((m, j) => (j === i ? { ...m, status } : m)));
  const picked = list.filter((m) => m.status === "Picked").length;
  const absent = list.filter((m) => m.status === "Absent").length;

  return (
    <>
      <PageHeader title="Student manifest" subtitle="Route 1 · morning pickup — tap to check in" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Picked up" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={picked} sub={`of ${list.length}`} />
        <StatTile label="Absent" tint={{}} value={absent} sub="parents notified" />
        <StatTile label="Pending" tint={{}} value={list.length - picked - absent} sub="stops left" />
        <StatTile label="Progress" tint={{}} value={`${Math.round((picked / list.length) * 100)}%`} sub="of route" />
      </div>

      <Card pad={false}>
        <div className="card-pad" style={{ paddingBottom: 6 }}>
          <div className="list">
            {list.map((m, i) => (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: "var(--line-soft)", color: "var(--muted)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.pin}</span></span>
                <div className="l-main">
                  <div className="l-t">{m.student} <span className="muted" style={{ fontWeight: 500 }}>· {m.grade}</span></div>
                  <div className="l-s">{m.stop} · {m.time}</div>
                </div>
                <div className="l-end" style={{ display: "inline-flex", gap: 6 }}>
                  <button onClick={() => mark(i, "Picked")} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: m.status === "Picked" ? "var(--good)" : "var(--panel)", color: m.status === "Picked" ? "#fff" : "var(--ink-soft)" }}>Picked</button>
                  <button onClick={() => mark(i, "Absent")} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: m.status === "Absent" ? "var(--bad)" : "var(--panel)", color: m.status === "Absent" ? "#fff" : "var(--ink-soft)" }}>Absent</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
