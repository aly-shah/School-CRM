"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Donut, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { students, pkr } from "@/lib/data";
import { getSession, isPaid, getPayment } from "@/lib/store";

export default function ParentFees() {
  const [child, setChild] = useState(students[0]);
  const [paid, setPaid] = useState(false);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const roll = getSession();
    const c = students.find((s) => String(s.roll) === String(roll)) || students[0];
    setChild(c);
    isPaid(c.roll).then(setPaid);
    getPayment(c.roll).then(setPayment);
  }, []);

  const f = child.fees || { annual: 180000, due: child.feeDue || 0, paid: 180000 - (child.feeDue || 0) };
  const due = paid ? 0 : f.due;
  const paidAmt = paid ? f.annual : f.paid;
  const pct = Math.round((paidAmt / f.annual) * 100);

  const items = [
    { k: "Term 1 tuition", s: "Paid · 12 Apr 2025", amt: 90000, kind: "good" },
    { k: "Term 2 tuition", s: paid ? "Paid — thank you" : "Rs 22,500 due · 15 Jul", amt: 67500, kind: paid ? "good" : "warn" },
    { k: "Transport (opt.)", s: "Waived", amt: 0, kind: "mute" },
  ];

  return (
    <>
      <PageHeader title="Fees" subtitle={`${child.name} · Grade ${child.grade} · Session 2025–26`}>
        <Link href="/parent/voucher" className="btn">{I.file}Voucher</Link>
      </PageHeader>

      <div className="grid g-2">
        <Card title="Fee summary">
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 8 }}>
            <Donut pct={pct} color={paid ? "var(--good)" : "var(--accent)"} label={paid ? "Paid" : "Paid"} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <Row c={paid ? "var(--good)" : "var(--accent)"} k="Paid" v={pkr(paidAmt)} />
              <Row c="var(--warn)" k="Due" v={pkr(due)} />
              <Row c="var(--line)" k="Annual fee" v={pkr(f.annual)} />
            </div>
          </div>
          {due > 0
            ? <Link href="/parent/pay" className="btn primary" style={{ width: "100%", marginTop: 6 }}>{I.card}Pay {pkr(due)} now</Link>
            : (
              <div style={{ marginTop: 6 }}>
                <div className="pill good" style={{ width: "100%", justifyContent: "center", padding: "9px" }}><span className="d" />All fees cleared</div>
                {payment && <Link href="/parent/pay" className="btn" style={{ width: "100%", marginTop: 8 }}>{I.receipt}View receipt</Link>}
              </div>
            )}
          <div className="soft" style={{ fontSize: 12, marginTop: 10, textAlign: "center" }}>Secure online payment · card, bank or wallet</div>
        </Card>

        <Card title="Fee schedule" pad={false}>
          <div className="card-pad">
            <div className="list">
              {items.map((it, i) => (
                <div key={i} className="list-row">
                  <div className="l-main"><div className="l-t">{it.k}</div><div className="l-s">{it.s}</div></div>
                  <div className="l-end"><span className="tnum" style={{ fontWeight: 700, color: `var(--${it.kind === "mute" ? "muted" : it.kind})` }}>{it.amt ? pkr(it.amt) : "—"}</span></div>
                </div>
              ))}
            </div>
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
