"use client";
import { useState } from "react";
import { PageHeader, StatTile } from "@/components/ui";
import { I } from "@/components/icons";
import { pkr } from "@/lib/data";
import DefaultersTable from "@/modules/DefaultersTable";

export default function Defaulters() {
  const [rows, setRows] = useState([]);
  const total = rows.reduce((a, b) => a + Number(b.fees?.due || b.feeDue || 0), 0);
  const big = rows.filter((s) => Number(s.fees?.due || s.feeDue || 0) >= 50000).length;

  return (
    <>
      <PageHeader title="Defaulters" subtitle="Outstanding dues — notify students & parents, one tap on WhatsApp" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Total overdue" icon={I.fees} tint={{ bg: "var(--bad-bg)", fg: "var(--bad)" }} value={pkr(total)} sub={`${rows.length} students`} />
        <StatTile label="Large dues" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={big} sub="≥ Rs 50,000" />
        <StatTile label="Reminders sent" icon={I.bell} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="184" sub="this month" />
        <StatTile label="Recovered (mo.)" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="Rs 12.4 L" sub="after reminders" />
      </div>

      <DefaultersTable onCount={setRows} />
    </>
  );
}
