"use client";
import { useEffect, useState } from "react";
import { PageHeader, Card } from "@/components/ui";
import { I } from "@/components/icons";
import { getCertificates, getSession } from "@/lib/store";
import Certificate from "@/modules/Certificate";

export default function StudentCertificates({ roll }) {
  const [list, setList] = useState([]);
  const [sel, setSel] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const r = roll || getSession() || "12";
    getCertificates(r).then((l) => { setList(l); setSel(l[0] || null); setReady(true); });
  }, [roll]);

  return (
    <>
      <PageHeader title="Certificates" subtitle="Awards & achievements" />
      {ready && list.length === 0 && (
        <Card><div className="soft" style={{ fontSize: 13, textAlign: "center", padding: 10 }}>No certificates yet — your teacher can award you one!</div></Card>
      )}
      {list.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {list.map((c) => (
              <button key={c.id} className="pill" onClick={() => setSel(c)}
                style={{ cursor: "pointer", border: "1px solid var(--line)", padding: "7px 12px", background: sel === c ? "var(--accent)" : "var(--panel)", color: sel === c ? "#fff" : "var(--ink-soft)" }}>
                {c.type}
              </button>
            ))}
          </div>
          <Certificate cert={sel} showPrint />
        </>
      )}
    </>
  );
}
