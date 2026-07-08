"use client";
import { useState } from "react";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";

const quick = ["Bus departed school", "Arriving in 5 minutes", "Running 10 min late", "Reached your stop"];

export default function DriverAlerts() {
  const [sent, setSent] = useState([
    { msg: "Bus departed school", when: "2:05 PM", to: "22 parents" },
  ]);
  const send = (msg) => setSent((s) => [{ msg, when: "Just now", to: "22 parents" }, ...s]);

  return (
    <>
      <PageHeader title="Alerts" subtitle="One-tap notifications to parents on your route" />

      <Card title="Send a quick alert" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {quick.map((q) => (
            <button key={q} className="btn" onClick={() => send(q)}>{I.megaphone}{q}</button>
          ))}
        </div>
      </Card>

      <Card title="Recent alerts" pad={false}>
        <div className="card-pad">
          <div className="list">
            {sent.map((a, i) => (
              <div key={i} className="list-row">
                <span className="l-ic" style={{ background: "var(--accent-weak)", color: "var(--accent)" }}><span style={{ display: "grid", placeItems: "center" }}>{I.megaphone}</span></span>
                <div className="l-main"><div className="l-t">{a.msg}</div><div className="l-s">Sent to {a.to}</div></div>
                <div className="l-end" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="muted" style={{ fontSize: 12 }}>{a.when}</span>
                  <Pill kind="good" dot>Delivered</Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
