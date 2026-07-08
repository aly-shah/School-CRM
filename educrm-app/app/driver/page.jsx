"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { routes, manifest } from "@/lib/data";
import LiveMap from "@/modules/LiveMap";

export default function DriverRoute() {
  const r = routes[0];
  const [started, setStarted] = useState(false);
  const next = manifest[0];
  return (
    <>
      <PageHeader title="My route" subtitle={`${r.name} · Bus ${r.bus}`}>
        <button className="btn primary" onClick={() => setStarted((s) => !s)}>
          <span style={{ display: "flex" }}>{I.route}</span>{started ? "End trip" : "Start morning trip"}
        </button>
      </PageHeader>

      <Card style={{ marginBottom: 20 }} pad={false}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent-weak)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24 }}>{I.bus}</span>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{started ? "Trip in progress" : "Ready to start"}</div>
            <div className="soft" style={{ fontSize: 13 }}>{started ? `Next stop: ${next.stop} · ${next.time}` : "Tap “Start morning trip” to begin pickups"}</div>
          </div>
          <Pill kind={started ? "good" : "mute"} dot>{started ? "On route" : "Idle"}</Pill>
        </div>
      </Card>

      <div style={{ marginBottom: 20 }}>
        <LiveMap showList={false} />
      </div>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Stops" icon={I.pin} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={r.stops} sub="on this route" />
        <StatTile label="Students" icon={I.students} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={r.students} sub="assigned" />
        <StatTile label="Picked up" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={started ? "0" : "—"} sub="this trip" />
        <StatTile label="ETA school" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="7:45" sub="on schedule" />
      </div>

      <Card title="Quick actions">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/driver/manifest" className="btn">{I.clipboard}Student manifest</Link>
          <Link href="/driver/alerts" className="btn">{I.megaphone}Send alert</Link>
          <Link href="/driver/vehicle" className="btn">{I.fuel}Vehicle log</Link>
        </div>
      </Card>
    </>
  );
}
