"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader, Card, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { students, pkr } from "@/lib/data";
import { getSession, isPaid, getPayment, setPaid } from "@/lib/store";

const inp = { width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", margin: "0 0 6px" };

export default function Pay() {
  const [child, setChild] = useState(students[0]);
  const [paid, setPaidState] = useState(false);
  const [payment, setPayment] = useState(null);
  const [form, setForm] = useState({ name: "", num: "", exp: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const roll = getSession();
    const c = students.find((s) => String(s.roll) === String(roll)) || students[0];
    setChild(c);
    getPayment(c.roll).then((p) => { if (p) { setPaidState(true); setPayment(p); } });
  }, []);

  const due = child.fees?.due ?? child.feeDue ?? 0;

  const pay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(async () => {
      const p = { amount: due, date: new Date().toLocaleString(), txn: "TXN-" + Date.now().toString().slice(-8), method: "Card •••• " + (form.num.replace(/\s/g, "").slice(-4) || "4242") };
      await setPaid(child.roll, p);
      setPaidState(true); setPayment(p); setProcessing(false);
    }, 900);
  };

  if (paid && payment) {
    return (
      <>
        <div className="no-print"><PageHeader title="Payment successful 🎉" subtitle={`${child.name} · Term 2 fees`} /></div>
        <div className="voucher-doc print-area" style={{ maxWidth: 560 }}>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--good-bg)", color: "var(--good)", display: "grid", placeItems: "center", margin: "0 auto 10px" }}>
              <span style={{ display: "grid", placeItems: "center", width: 26, height: 26 }}>{I.check}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 750 }}>Payment received</div>
            <div className="soft" style={{ fontSize: 13 }}>Receipt · Springdale International School</div>
          </div>
          <div className="v-student" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div><span className="k">Student</span><b>{child.name}</b></div>
            <div><span className="k">Class</span><b>Grade {child.grade}</b></div>
            <div><span className="k">Transaction</span><b className="tnum">{payment.txn}</b></div>
            <div><span className="k">Method</span><b>{payment.method}</b></div>
            <div><span className="k">Date</span><b>{payment.date}</b></div>
            <div><span className="k">Status</span><b style={{ color: "var(--good)" }}>Paid</b></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "2px solid var(--ink)", marginTop: 8 }}>
            <b style={{ fontSize: 15 }}>Amount paid</b>
            <b className="tnum" style={{ fontSize: 20, color: "var(--good)" }}>{pkr(payment.amount)}</b>
          </div>
          <div className="v-generated">Thank you. A copy has been emailed to your registered address.</div>
        </div>
        <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link href="/parent/fees" className="btn">← Back to fees</Link>
          <button className="btn primary" onClick={() => window.print()}>{I.print}Print receipt</button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Pay fees" subtitle={`${child.name} · Term 2 · 2025–26`} />
      <div className="grid g-2">
        <Card title="Amount due">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Row k="Term 2 tuition & charges" v={pkr(due)} />
            <Row k="Processing fee" v="Rs 0" muted />
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>Total</b><b className="tnum" style={{ fontSize: 20 }}>{pkr(due)}</b>
            </div>
          </div>
          <div className="soft" style={{ fontSize: 12, marginTop: 12 }}>Secure payment · your card details are never stored.</div>
        </Card>

        <Card title="Card details">
          <form onSubmit={pay}>
            <label style={lbl}>Name on card</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sana Khan" style={{ ...inp, marginBottom: 14 }} />
            <label style={lbl}>Card number</label>
            <input required value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} placeholder="4242 4242 4242 4242" style={{ ...inp, marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1 }}><label style={lbl}>Expiry</label><input required value={form.exp} onChange={(e) => setForm({ ...form, exp: e.target.value })} placeholder="MM/YY" style={inp} /></div>
              <div style={{ flex: 1 }}><label style={lbl}>CVV</label><input required value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} placeholder="123" style={inp} /></div>
            </div>
            <button type="submit" className="btn primary" disabled={processing || !due} style={{ width: "100%" }}>
              {processing ? "Processing…" : <>{I.card}Pay {pkr(due)}</>}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}

function Row({ k, v, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: muted ? "var(--muted)" : "inherit" }}>
      <span>{k}</span><span className="tnum" style={{ fontWeight: 600 }}>{v}</span>
    </div>
  );
}
