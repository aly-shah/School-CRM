"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, StatTile, Pill, Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { manifest } from "@/lib/data";
import { getDrivers } from "@/lib/store";

export default function DriverRoute() {
  const [driver, setDriver] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | requesting | on | denied | unsupported
  const [coords, setCoords] = useState(null);
  const [started, setStarted] = useState(false);
  const watchRef = useRef(null);
  const next = manifest[0];

  useEffect(() => {
    getDrivers().then((ds) => setDriver(ds.find((d) => d.name === "Rashid Mehmood") || ds[0] || null));
    return () => { if (watchRef.current != null && navigator.geolocation) navigator.geolocation.clearWatch(watchRef.current); };
  }, []);

  const enableLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) { setLocStatus("unsupported"); return; }
    setLocStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("on");
        watchRef.current = navigator.geolocation.watchPosition(
          (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => {}, { enableHighAccuracy: true, maximumAge: 5000 }
        );
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const on = locStatus === "on";
  const toggleTrip = () => { if (on) setStarted((s) => !s); };
  const r = driver || {};

  return (
    <>
      <PageHeader title="My route" subtitle={`${r.route || "Route 1 · North Loop"} · Bus ${r.bus || "—"}`}>
        <button className="btn primary" onClick={toggleTrip} disabled={!on}>
          <span style={{ display: "flex" }}>{I.route}</span>{started ? "End trip" : "Start morning trip"}
        </button>
      </PageHeader>

      {/* driver profile */}
      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {r.photo
            ? <img src={r.photo} alt={r.name} style={{ width: 60, height: 60, borderRadius: 16, objectFit: "cover" }} />
            : <Avatar name={r.name || "Driver"} size={60} radius fs={22} />}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{r.name || "Driver"}</div>
            <div className="soft" style={{ fontSize: 13 }}>CNIC {r.cnic || "—"} · Licence {r.license_no || "—"}</div>
          </div>
          <Pill kind="good" dot>{r.status || "Active"}</Pill>
        </div>
      </Card>

      {/* location gate */}
      <Card style={{ marginBottom: 20 }} pad={false}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, flex: "0 0 auto", display: "grid", placeItems: "center",
            background: on ? "var(--good-bg)" : locStatus === "denied" ? "var(--bad-bg)" : "var(--warn-bg)",
            color: on ? "var(--good)" : locStatus === "denied" ? "var(--bad)" : "var(--warn)" }}>
            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24 }}>{I.pin}</span>
          </span>
          <div style={{ flex: 1, minWidth: 200 }}>
            {on ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Location active</div>
                <div className="soft tnum" style={{ fontSize: 12.5 }}>{coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "acquiring…"} · live</div>
              </>
            ) : locStatus === "denied" ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--bad)" }}>Location permission denied</div>
                <div className="soft" style={{ fontSize: 12.5 }}>Enable location for this site in your browser/phone settings, then retry.</div>
              </>
            ) : locStatus === "unsupported" ? (
              <div style={{ fontSize: 14, fontWeight: 600 }}>Location isn't supported on this device.</div>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Turn on your location to start the route</div>
                <div className="soft" style={{ fontSize: 12.5 }}>Parents track the bus live — the route can't start until location is on.</div>
              </>
            )}
          </div>
          {!on && <button className="btn primary" onClick={enableLocation} disabled={locStatus === "requesting"}>{I.pin}{locStatus === "requesting" ? "Requesting…" : locStatus === "denied" ? "Retry" : "Enable location"}</button>}
          {on && <Pill kind="good" dot>GPS on</Pill>}
        </div>
      </Card>

      {/* trip status */}
      <Card pad={false} style={{ marginBottom: 20 }}>
        <div className="card-pad" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, background: "var(--accent-weak)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
            <span style={{ display: "grid", placeItems: "center", width: 24, height: 24 }}>{I.bus}</span>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{started ? "Trip in progress" : on ? "Ready to start" : "Waiting for location"}</div>
            <div className="soft" style={{ fontSize: 13 }}>{started ? `Next stop: ${next.stop} · ${next.time}` : on ? "Tap “Start morning trip” to begin pickups" : "Enable location above first"}</div>
          </div>
          <Pill kind={started ? "good" : "mute"} dot>{started ? "On route" : "Idle"}</Pill>
        </div>
      </Card>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Stops" icon={I.pin} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="8" sub="on this route" />
        <StatTile label="Students" icon={I.students} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="22" sub="assigned" />
        <StatTile label="Picked up" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={started ? "0" : "—"} sub="this trip" />
        <StatTile label="ETA school" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="7:45" sub="on schedule" />
      </div>

      <Card title="Quick actions">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/driver/live" className="btn">{I.pin}Live map</Link>
          <Link href="/driver/manifest" className="btn">{I.clipboard}Student manifest</Link>
          <Link href="/driver/alerts" className="btn">{I.megaphone}Send alert</Link>
          <Link href="/driver/vehicle" className="btn">{I.fuel}Vehicle log</Link>
        </div>
      </Card>
    </>
  );
}
