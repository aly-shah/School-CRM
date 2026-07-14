"use client";
import { useMemo, useState } from "react";
import { PageHeader, StatTile, Card, Avatar, Table, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { classRoster, eventMonth } from "@/lib/data";
import SwipeAttendance from "@/modules/SwipeAttendance";

// deterministic mock history so past days are consistent across reloads
const statusFor = (roll, day) => {
  const h = (roll * 13 + day * 7) % 29;
  if (h === 0 || h === 5) return "A";
  if (h === 11) return "L";
  return "P";
};
const isSunday = (day) => ((eventMonth.firstDow + day - 1) % 7) === 0;
const cellStyle = (st) =>
  st === "P" ? { t: "P", c: "var(--good)", b: "var(--good-bg)" }
    : st === "A" ? { t: "A", c: "var(--bad)", b: "var(--bad-bg)" }
      : { t: "L", c: "var(--warn)", b: "var(--warn-bg)" };

export default function Attendance({ subtitle = "Grade 6-B · Class Teacher: Sadia Karim" }) {
  const [tab, setTab] = useState("swipe");

  // ---- school days this month, up to today ----
  const schoolDays = useMemo(() => {
    const a = [];
    for (let d = 1; d <= eventMonth.today; d++) if (!isSunday(d)) a.push(d);
    return a;
  }, []);
  const pastDays = schoolDays.filter((d) => d < eventMonth.today);

  // ---- Today: marking ----
  const [roster, setRoster] = useState(classRoster);
  const [saved, setSaved] = useState(false);
  const present = roster.filter((r) => r.present).length;
  const setMark = (roll, val) => { setRoster((rs) => rs.map((r) => (r.roll === roll ? { ...r, present: val } : r))); setSaved(false); };

  // ---- History ----
  const [histDay, setHistDay] = useState(pastDays[pastDays.length - 1] || schoolDays[0]);
  const histIdx = schoolDays.indexOf(histDay);
  const histRows = classRoster.map((s) => ({ ...s, st: statusFor(s.roll, histDay) }));
  const hP = histRows.filter((r) => r.st === "P").length;
  const hA = histRows.filter((r) => r.st === "A").length;
  const hL = histRows.filter((r) => r.st === "L").length;

  // ---- Monthly report ----
  const report = classRoster.map((s) => {
    const cells = schoolDays.map((d) => statusFor(s.roll, d));
    const P = cells.filter((x) => x === "P").length;
    const A = cells.filter((x) => x === "A").length;
    const L = cells.filter((x) => x === "L").length;
    return { ...s, cells, P, A, L, pct: Math.round((P / cells.length) * 100) };
  });

  const exportCSV = () => {
    const head = ["Roll", "Name", ...schoolDays.map((d) => `Jul ${d}`), "Present", "Absent", "Late", "%"];
    const lines = [head.join(",")];
    report.forEach((s) => lines.push([s.roll, s.name, ...s.cells, s.P, s.A, s.L, s.pct + "%"].join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "attendance-july-2026.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const dateLabel = (d) => `${d} Jul 2026`;

  return (
    <>
      <PageHeader title="Attendance" subtitle={subtitle} />

      <div className="tabs no-print" style={{ marginBottom: 20 }}>
        {[["swipe", "Swipe ✋"], ["today", "Today"], ["history", "History"], ["report", "Monthly report"]].map(([k, l]) => (
          <a key={k} href="#" onClick={(e) => { e.preventDefault(); setTab(k); }} className={tab === k ? "active" : ""}>{l}</a>
        ))}
      </div>

      {/* ---------------- SWIPE (Tinder-style) ---------------- */}
      {tab === "swipe" && <SwipeAttendance />}

      {/* ---------------- TODAY ---------------- */}
      {tab === "today" && (
        <>
          <div className="tiles" style={{ marginBottom: 20 }}>
            <StatTile label="Present" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={present} sub={`of ${roster.length}`} />
            <StatTile label="Absent" tint={{}} value={roster.length - present} sub="auto-alert to parents" />
            <StatTile label="Rate today" tint={{}} value={`${Math.round((present / roster.length) * 100)}%`} sub="6 Jul 2026" />
            <StatTile label="Class average" tint={{}} value="94%" sub="term to date" />
          </div>
          <div className="card">
            <div className="card-h">
              <h3>Roster · 6 Jul 2026</h3>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {saved && <span className="pill good"><span className="d" />Saved</span>}
                <button className="btn" onClick={() => { setRoster((rs) => rs.map((r) => ({ ...r, present: true }))); setSaved(false); }}>All present</button>
                <button className="btn primary" onClick={() => setSaved(true)}>{I.check}Save</button>
              </div>
            </div>
            <Table
              minWidth={420}
              rows={roster}
              cols={[
                { label: "Student", render: (r) => <div className="who"><Avatar name={r.name} size={30} /><span className="nm">{r.name}</span></div> },
                { label: "Roll", render: (r) => <span className="soft tnum">{r.roll}</span> },
                { label: "Mark", align: "r", render: (r) => (
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button onClick={() => setMark(r.roll, true)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: r.present ? "var(--good)" : "var(--panel)", color: r.present ? "#fff" : "var(--ink-soft)" }}>Present</button>
                    <button onClick={() => setMark(r.roll, false)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: !r.present ? "var(--bad)" : "var(--panel)", color: !r.present ? "#fff" : "var(--ink-soft)" }}>Absent</button>
                  </div>
                ) },
              ]}
            />
          </div>
        </>
      )}

      {/* ---------------- HISTORY ---------------- */}
      {tab === "history" && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button className="btn" disabled={histIdx <= 0} onClick={() => setHistDay(schoolDays[Math.max(0, histIdx - 1)])}>← Prev day</button>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{dateLabel(histDay)}</div>
              <button className="btn" disabled={histIdx >= schoolDays.length - 1} onClick={() => setHistDay(schoolDays[Math.min(schoolDays.length - 1, histIdx + 1)])}>Next day →</button>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {schoolDays.map((d) => (
                  <button key={d} onClick={() => setHistDay(d)} className="pill" style={{ cursor: "pointer", border: "1px solid var(--line)", background: d === histDay ? "var(--accent)" : "var(--panel)", color: d === histDay ? "#fff" : "var(--ink-soft)" }}>Jul {d}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="tiles" style={{ marginBottom: 20 }}>
            <StatTile label="Present" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={hP} sub={`of ${histRows.length}`} />
            <StatTile label="Absent" tint={{}} value={hA} sub="on this day" />
            <StatTile label="Late" tint={{}} value={hL} sub="on this day" />
            <StatTile label="Rate" tint={{}} value={`${Math.round((hP / histRows.length) * 100)}%`} sub={dateLabel(histDay)} />
          </div>

          <Card title={`Roster · ${dateLabel(histDay)}`} pad={false}>
            <Table
              minWidth={420}
              rows={histRows}
              cols={[
                { label: "Student", render: (r) => <div className="who"><Avatar name={r.name} size={30} /><span className="nm">{r.name}</span></div> },
                { label: "Roll", render: (r) => <span className="soft tnum">{r.roll}</span> },
                { label: "Status", align: "r", render: (r) => { const c = cellStyle(r.st); return <Pill kind={r.st === "P" ? "good" : r.st === "A" ? "bad" : "warn"} dot>{r.st === "P" ? "Present" : r.st === "A" ? "Absent" : "Late"}</Pill>; } },
              ]}
            />
          </Card>
        </>
      )}

      {/* ---------------- MONTHLY REPORT ---------------- */}
      {tab === "report" && (
        <>
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div className="soft" style={{ fontSize: 13, marginRight: "auto" }}>July 2026 · {schoolDays.length} school days to date</div>
            <button className="btn" onClick={() => window.print()}>{I.print}Print</button>
            <button className="btn primary" onClick={exportCSV}>{I.download}Export CSV</button>
          </div>

          <div className="card print-area">
            <div className="card-h"><h3>Monthly attendance report · Grade 6-B · July 2026</h3></div>
            <div className="tbl-wrap">
              <table className="tbl compact" style={{ minWidth: 640 }}>
                <thead>
                  <tr>
                    <th style={{ position: "sticky", left: 0, background: "var(--panel-2)" }}>Student</th>
                    {schoolDays.map((d) => <th key={d} className="r" style={{ padding: "11px 8px" }}>{d}</th>)}
                    <th className="r">P</th><th className="r">A</th><th className="r">L</th><th className="r">%</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((s) => (
                    <tr key={s.roll}>
                      <td style={{ position: "sticky", left: 0, background: "var(--panel)", fontWeight: 600, whiteSpace: "nowrap" }}>{s.name}</td>
                      {s.cells.map((st, i) => { const c = cellStyle(st); return (
                        <td key={i} className="r" style={{ textAlign: "center", padding: "8px 6px" }}>
                          <span style={{ display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: 6, background: c.b, color: c.c, fontWeight: 700, fontSize: 11 }}>{c.t}</span>
                        </td>
                      ); })}
                      <td className="r tnum" style={{ color: "var(--good)", fontWeight: 600 }}>{s.P}</td>
                      <td className="r tnum" style={{ color: "var(--bad)", fontWeight: 600 }}>{s.A}</td>
                      <td className="r tnum" style={{ color: "var(--warn)", fontWeight: 600 }}>{s.L}</td>
                      <td className="r tnum" style={{ fontWeight: 700 }}>{s.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-pad" style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "var(--ink-soft)" }}>
              <span><b style={{ color: "var(--good)" }}>P</b> Present</span>
              <span><b style={{ color: "var(--bad)" }}>A</b> Absent</span>
              <span><b style={{ color: "var(--warn)" }}>L</b> Late</span>
              <span style={{ marginLeft: "auto" }}>Class average: <b>{Math.round(report.reduce((a, b) => a + b.pct, 0) / report.length)}%</b></span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
