"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { I } from "@/components/icons";
import { students, pkr } from "@/lib/data";
import { isPaid } from "@/lib/store";

function words(num) {
  if (!num) return "Zero";
  const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const two = (n) => (n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : ""));
  const three = (n) => { const h = Math.floor(n / 100), r = n % 100; return (h ? a[h] + " hundred" + (r ? " " : "") : "") + (r ? two(r) : ""); };
  let res = "";
  const cr = Math.floor(num / 10000000); num %= 10000000;
  const la = Math.floor(num / 100000); num %= 100000;
  const th = Math.floor(num / 1000); num %= 1000;
  if (cr) res += three(cr) + " crore ";
  if (la) res += two(la) + " lakh ";
  if (th) res += two(th) + " thousand ";
  if (num) res += three(num);
  res = res.trim();
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function particulars(due) {
  const exam = 3000, lab = 2000, misc = 2500;
  const tuition = Math.max(0, due - (exam + lab + misc));
  return [
    { k: "Tuition Fee — Term 2", v: tuition },
    { k: "Examination Fee", v: exam },
    { k: "Computer / Science Lab", v: lab },
    { k: "Activities & Misc.", v: misc },
  ].filter((r) => r.v > 0);
}

export default function FeeVoucher({ studentId, backHref }) {
  const s = students.find((x) => x.id === studentId) || students[0];
  const due = s.fees?.due ?? s.feeDue ?? 22500;
  const rows = particulars(due);
  const total = rows.reduce((a, b) => a + b.v, 0);
  const voucherNo = `SIS-2526-${String(s.roll).padStart(4, "0")}-T2`;

  const [paid, setPaid] = useState(false);
  useEffect(() => { isPaid(s.roll).then(setPaid); }, [s.roll]);

  return (
    <>
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {backHref && <Link href={backHref} className="soft" style={{ fontSize: 13, marginRight: "auto" }}>&larr; Back</Link>}
        <button className="btn" onClick={() => window.print()}>{I.print}Print</button>
        <button className="btn primary" onClick={() => window.print()}>{I.download}Download PDF</button>
      </div>

      <div className="voucher-doc print-area" style={{ position: "relative" }}>
        {paid && <div className="paid-stamp">PAID</div>}
        <div className="v-head">
          <div className="v-logo">
            <span className="logo" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#6d5efc,#4a3ad6)", display: "grid", placeItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
            </span>
            <div>
              <div className="v-school">Springdale International School</div>
              <div className="v-addr">Sector 8, Springdale · +92 42 111 000 360 · accounts@springdale.edu</div>
            </div>
          </div>
          <div className="v-title">
            <div className="v-title-t">FEE VOUCHER</div>
            <div className="v-title-s">Session 2025–26 · Term 2</div>
          </div>
        </div>

        <div className="v-meta">
          <div><span className="k">Voucher No.</span><b className="tnum">{voucherNo}</b></div>
          <div><span className="k">Issue date</span><b>01 Jul 2026</b></div>
          <div><span className="k">Due date</span><b style={{ color: "var(--bad)" }}>15 Jul 2026</b></div>
          <div><span className="k">Status</span><b style={{ color: paid ? "var(--good)" : due ? "var(--warn)" : "var(--good)" }}>{paid ? "Paid" : due ? "Unpaid" : "Paid"}</b></div>
        </div>

        <div className="v-student">
          <div><span className="k">Student</span><b>{s.name}</b></div>
          <div><span className="k">Father / Guardian</span><b>{s.father?.name || s.parent?.name || "—"}</b></div>
          <div><span className="k">Class / Section</span><b>Grade {s.grade}</b></div>
          <div><span className="k">Roll No.</span><b className="tnum">{s.roll}</b></div>
          <div><span className="k">Admission No.</span><b className="tnum">{s.id}</b></div>
          <div><span className="k">Billing month</span><b>July 2026</b></div>
        </div>

        <table className="v-table">
          <thead><tr><th>#</th><th>Fee particulars</th><th className="r">Amount</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td className="tnum">{i + 1}</td><td>{r.k}</td><td className="r tnum">{pkr(r.v)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td /><td>Total payable</td><td className="r tnum">{pkr(total)}</td></tr>
          </tfoot>
        </table>

        <div className="v-words">Amount in words: <b>{words(total)} rupees only.</b></div>

        <div className="v-note">
          <b>Payment instructions:</b> Pay online via the parent app, or deposit at any Springdale Bank branch quoting the voucher number.
          A late fee of Rs 500 applies after the due date. Please retain the receipt.
        </div>

        <div className="v-foot">
          <div className="v-barcode" aria-hidden="true" />
          <div className="v-sign">
            <div><div className="line" /><span>Accountant</span></div>
            <div><div className="line" /><span>Received by</span></div>
          </div>
        </div>
        <div className="v-generated">This is a computer-generated voucher — no signature required for the school copy.</div>
      </div>
    </>
  );
}
