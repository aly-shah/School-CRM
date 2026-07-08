"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatTile, Card, Pill, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { getStaff, addStaff } from "@/lib/store";

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0 };
const DEPTS = ["Academics", "Finance", "Operations", "Administration"];

export default function StaffDirectory({ showStats = true }) {
  const [list, setList] = useState([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", dept: "Academics", phone: "" });

  useEffect(() => { getStaff().then(setList); }, []);

  const create = async () => {
    if (!form.name.trim() || !form.role.trim()) return;
    const m = { name: form.name.trim(), role: form.role.trim(), dept: form.dept, phone: form.phone.trim() || "—", status: "On duty" };
    await addStaff(m);
    setList(await getStaff());
    setForm({ name: "", role: "", dept: "Academics", phone: "" });
    setAdding(false);
  };

  return (
    <>
      <PageHeader title="Staff & HR" subtitle="Profiles, attendance, leave and payroll in one place">
        <button className="btn primary" onClick={() => setAdding((a) => !a)}><span style={{ display: "flex" }}>{I.plus}</span>Add staff</button>
      </PageHeader>

      {adding && (
        <Card title="New staff member" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={{ ...inp, flex: "1 1 180px" }} />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role — e.g. Maths Teacher" style={{ ...inp, flex: "1 1 200px" }} />
            <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} style={{ ...inp, flex: "0 1 150px" }}>
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" style={{ ...inp, flex: "1 1 150px" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={() => setAdding(false)}>Cancel</button>
            <button className="btn primary" onClick={create} style={{ marginLeft: "auto" }}>{I.plus}Add staff</button>
          </div>
        </Card>
      )}

      {showStats && (
        <div className="tiles" style={{ marginBottom: 20 }}>
          <StatTile label="Total staff" icon={I.staff} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={list.length} sub="on record" />
          <StatTile label="On duty today" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={list.filter((m) => m.status === "On duty").length} sub="present" />
          <StatTile label="On leave" icon={I.clock} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={list.filter((m) => m.status !== "On duty").length} sub="today" />
          <StatTile label="Payroll (month)" icon={I.fees} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="Rs 1.2 Cr" sub="processed" />
        </div>
      )}

      <Card title="Staff directory" pad={false}>
        <Table
          minWidth={640}
          rows={list}
          cols={[
            { label: "Name", render: (m) => <div className="who"><Avatar name={m.name} size={32} /><span className="nm">{m.name}</span></div> },
            { label: "Role", render: (m) => <span className="soft">{m.role}</span> },
            { label: "Department", render: (m) => <span className="soft">{m.dept}</span> },
            { label: "Phone", render: (m) => <span className="soft tnum">{m.phone}</span> },
            { label: "Status", align: "r", render: (m) => <Pill kind={m.status === "On duty" ? "good" : "warn"} dot>{m.status}</Pill> },
          ]}
        />
      </Card>
    </>
  );
}
