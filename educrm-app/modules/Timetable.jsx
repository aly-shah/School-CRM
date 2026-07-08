import { PageHeader } from "@/components/ui";
import { I } from "@/components/icons";
import { timetable, subjectColor } from "@/lib/data";

export default function Timetable({ subtitle = "Grade 6-B · weekly schedule" }) {
  const { periods, days, grid } = timetable;
  return (
    <>
      <PageHeader title="Timetable" subtitle={subtitle}>
        <button className="btn"><span style={{ display: "flex" }}>{I.edit}</span>Edit</button>
        <button className="btn primary"><span style={{ display: "flex" }}>{I.download}</span>Print</button>
      </PageHeader>

      <div className="card card-pad" style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `70px repeat(${periods.length}, minmax(96px, 1fr))`, gap: 8, minWidth: 700 }}>
          <div />
          {periods.map((p) => (
            <div key={p} className="tnum" style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", fontWeight: 600 }}>{p}</div>
          ))}
          {days.map((day, di) => (
            <Row key={day} day={day} row={grid[di]} />
          ))}
        </div>
      </div>
    </>
  );
}

function Row({ day, row }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{day}</div>
      {row.map((subj, i) => {
        const c = subjectColor[subj] || "var(--muted)";
        return (
          <div key={i} style={{ background: `${c}14`, border: `1px solid ${c}33`, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, margin: "0 auto 6px" }} />
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>{subj}</div>
          </div>
        );
      })}
    </>
  );
}
