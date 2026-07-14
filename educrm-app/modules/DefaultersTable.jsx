"use client";
import { useEffect, useState } from "react";
import { Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import WaButton from "@/components/WaButton";
import { pkr } from "@/lib/data";
import { getStudents, remindFees } from "@/lib/store";

const guardian = (s) => s.parent || s.father || null;
const feeMsg = (s) => {
  const g = guardian(s);
  const name = g?.name || "Parent";
  return `Assalam-o-Alaikum ${name}. This is a reminder from EduCRM 360 School regarding ${s.name} (Class ${s.grade}). A school fee of ${pkr(s.fees?.due || s.feeDue || 0)} is currently outstanding. Kindly clear the dues at your earliest convenience. JazakAllah.`;
};

export default function DefaultersTable({ onCount }) {
  const [list, setList] = useState([]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getStudents().then((all) => {
      const d = all.filter((s) => Number(s.fees?.due || s.feeDue || 0) > 0)
        .sort((a, b) => (b.fees?.due || b.feeDue) - (a.fees?.due || a.feeDue));
      setList(d);
      onCount && onCount(d);
    });
  }, []);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 3200); };

  const remindOne = async (s) => {
    await remindFees([{ roll: s.roll, name: s.name, due: s.fees?.due || s.feeDue }]);
    flash(`Reminder sent to ${s.name} & parent`);
  };
  const remindAll = async () => {
    if (!list.length) return;
    setBusy(true);
    const n = await remindFees(list.map((s) => ({ roll: s.roll, name: s.name, due: s.fees?.due || s.feeDue })));
    setBusy(false);
    flash(`${n} reminder${n === 1 ? "" : "s"} sent — student & parent portals notified`);
  };

  return (
    <div className="card">
      <div className="card-h">
        <h3>Defaulters</h3>
        <button className="btn primary" onClick={remindAll} disabled={busy} style={{ padding: "6px 12px" }}>{I.bell}{busy ? "Sending…" : "Remind all"}</button>
      </div>
      <Table
        minWidth={560}
        rows={list}
        empty="No outstanding fees. 🎉"
        cols={[
          { label: "Student", render: (s) => <div className="who"><Avatar name={s.name} size={30} /><span><span className="nm">{s.name}</span><br /><span className="sc">Roll {s.roll} · {guardian(s)?.name || "—"}</span></span></div> },
          { label: "Class", render: (s) => <span className="soft">{s.grade}</span> },
          { label: "Outstanding", align: "r", render: (s) => <span className="tnum" style={{ fontWeight: 700 }}>{pkr(s.fees?.due || s.feeDue)}</span> },
          { label: "Action", align: "r", render: (s) => (
            <div style={{ display: "inline-flex", gap: 7, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button className="btn" style={{ padding: "6px 11px" }} onClick={() => remindOne(s)}>{I.bell}Remind</button>
              <WaButton phone={guardian(s)?.phone} text={feeMsg(s)} label="WhatsApp" onSent={() => remindOne(s)} />
            </div>
          ) },
        ]}
      />
      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 84, transform: "translateX(-50%)", zIndex: 60, background: "var(--ink)", color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.25)", maxWidth: "90vw" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
