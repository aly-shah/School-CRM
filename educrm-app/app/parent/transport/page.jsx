import { PageHeader, Card, StatTile, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { routes, manifest } from "@/lib/data";
import LiveMap from "@/modules/LiveMap";

export default function ParentTransport() {
  const r = routes[0];
  const stops = manifest.slice(0, 4);
  return (
    <>
      <PageHeader title="Transport" subtitle={`${r.name} · Bus ${r.bus} · driver ${r.driver}`} />

      <div style={{ marginBottom: 20 }}>
        <LiveMap showList={false} highlightStop="Rose Villa" />
      </div>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Pickup" tint={{}} value="6:55" sub="Rose Villa" />
        <StatTile label="Drop-off" tint={{}} value="2:20" sub="school → home" />
        <StatTile label="Bus" tint={{}} value={r.bus} sub="42-seater" />
        <StatTile label="On board" tint={{}} value={`${r.students}`} sub="students today" />
      </div>

      <Card title="Route stops">
        <div className="list">
          {stops.map((s, i) => (
            <div key={i} className="list-row">
              <span className="l-ic" style={{ background: i === 0 ? "var(--accent-weak)" : "var(--line-soft)", color: i === 0 ? "var(--accent)" : "var(--muted)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.pin}</span></span>
              <div className="l-main"><div className="l-t">{s.stop}</div><div className="l-s">{s.student} · {s.grade}</div></div>
              <div className="l-end"><Pill kind={i === 0 ? "info" : "mute"}>{s.time}</Pill></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
