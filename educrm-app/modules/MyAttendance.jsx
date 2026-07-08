import { PageHeader, Card, StatTile, Donut } from "@/components/ui";
import { eventMonth, attStatus, isJulSunday } from "@/lib/data";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const col = { P: ["var(--good)", "var(--good-bg)"], A: ["var(--bad)", "var(--bad-bg)"], L: ["var(--warn)", "var(--warn-bg)"] };

export default function MyAttendance({ roll = 12 }) {
  const days = [];
  for (let d = 1; d <= eventMonth.today; d++) if (!isJulSunday(d)) days.push(d);
  const P = days.filter((d) => attStatus(roll, d) === "P").length;
  const A = days.filter((d) => attStatus(roll, d) === "A").length;
  const L = days.filter((d) => attStatus(roll, d) === "L").length;
  const pct = Math.round((P / days.length) * 100);

  const cells = [];
  for (let i = 0; i < eventMonth.firstDow; i++) cells.push(null);
  for (let d = 1; d <= eventMonth.days; d++) cells.push(d);

  return (
    <>
      <PageHeader title="My attendance" subtitle="July 2026 · Grade 6-B" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Attendance" tint={{}} value={`${pct}%`} sub="this month" />
        <StatTile label="Present" tint={{}} value={P} sub={`of ${days.length} days`} />
        <StatTile label="Absent" tint={{}} value={A} sub="days" />
        <StatTile label="Late" tint={{}} value={L} sub="days" />
      </div>

      <div className="grid g-2">
        <Card title="This term">
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Donut pct={pct} color="var(--good)" label="Present" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <Row c="var(--good)" k="Present" v={P} />
              <Row c="var(--warn)" k="Late" v={L} />
              <Row c="var(--bad)" k="Absent" v={A} />
            </div>
          </div>
        </Card>

        <Card title="July 2026">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {DOW.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>{d}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const future = d > eventMonth.today;
              const sun = isJulSunday(d);
              const st = !future && !sun ? attStatus(roll, d) : null;
              const cc = st ? col[st] : null;
              return (
                <div key={i} style={{ minHeight: 44, borderRadius: 8, border: "1px solid var(--line-soft)", padding: "5px 6px", background: cc ? cc[1] : "var(--panel)", opacity: future ? 0.45 : 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{d}</div>
                  {st && <div style={{ fontSize: 10.5, fontWeight: 700, color: cc[0] }}>{st}</div>}
                  {sun && <div style={{ fontSize: 10, color: "var(--muted)" }}>H</div>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11.5, color: "var(--ink-soft)", flexWrap: "wrap" }}>
            {[["P", "Present", "var(--good)"], ["A", "Absent", "var(--bad)"], ["L", "Late", "var(--warn)"], ["H", "Holiday", "var(--muted)"]].map(([t, l, c]) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><b style={{ color: c }}>{t}</b>{l}</span>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Row({ c, k, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{k}
      <span className="tnum" style={{ marginLeft: "auto", fontWeight: 700 }}>{v}</span>
    </div>
  );
}
