import { PageHeader, Card } from "@/components/ui";
import { eventMonth, events, eventType } from "@/lib/data";

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EventsCalendar() {
  const byDay = {};
  events.forEach((e) => { (byDay[e.day] = byDay[e.day] || []).push(e); });

  const cells = [];
  for (let i = 0; i < eventMonth.firstDow; i++) cells.push(null);
  for (let d = 1; d <= eventMonth.days; d++) cells.push(d);

  const upcoming = events.filter((e) => e.type !== "Today" && e.day >= eventMonth.today).sort((a, b) => a.day - b.day);

  return (
    <>
      <PageHeader title="Events" subtitle={`${eventMonth.name} · school calendar`} />

      <div className="grid g-2">
        <Card title={eventMonth.name}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {DOW.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--muted)", padding: "2px 0" }}>{d}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const evs = (byDay[d] || []).filter((e) => e.type !== "Today");
              const isToday = d === eventMonth.today;
              return (
                <div key={i} style={{ minHeight: 52, border: "1px solid var(--line-soft)", borderRadius: 8, padding: "5px 6px", background: isToday ? "var(--accent-weak)" : "var(--panel)" }}>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? "var(--accent-ink)" : "var(--ink)" }}>{d}</div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 5 }}>
                    {evs.map((e, j) => <span key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: eventType[e.type] || "var(--muted)" }} />)}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            {["Meeting", "Event", "Fees", "Sports", "Academics"].map((t) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-soft)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: eventType[t] }} />{t}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Upcoming events">
          <div className="list">
            {upcoming.map((e, i) => (
              <div key={i} className="list-row">
                <div style={{ width: 42, textAlign: "center", flex: "0 0 auto" }}>
                  <div style={{ fontSize: 18, fontWeight: 750, lineHeight: 1 }}>{e.day}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>Jul</div>
                </div>
                <div className="l-main"><div className="l-t">{e.title}</div><div className="l-s">{e.time}</div></div>
                <div className="l-end"><span className="pill" style={{ background: (eventType[e.type] || "var(--muted)") + "22", color: eventType[e.type] || "var(--muted)" }}>{e.type}</span></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
