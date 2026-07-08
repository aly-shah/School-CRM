"use client";
import { I } from "@/components/icons";

export default function Certificate({ cert, showPrint }) {
  if (!cert) return null;
  return (
    <>
      {showPrint && (
        <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <button className="btn primary" onClick={() => window.print()}>{I.print}Print certificate</button>
        </div>
      )}
      <div className="cert-doc print-area">
        <div className="cert-border">
          <div className="cert-seal"><span style={{ display: "grid", placeItems: "center", width: 30, height: 30 }}>{I.award}</span></div>
          <div className="cert-school">Springdale International School</div>
          <div className="cert-kicker">Certificate of {cert.type}</div>
          <div className="cert-present">This certificate is proudly presented to</div>
          <div className="cert-name">{cert.student}</div>
          <div className="cert-for">for</div>
          <div className="cert-title">{cert.title}</div>
          {cert.desc && <div className="cert-desc">{cert.desc}</div>}
          <div className="cert-foot">
            <div className="cert-sig"><div className="line" /><span>{cert.issuedBy || "Class Teacher"}</span></div>
            <div className="cert-date">{cert.date}</div>
            <div className="cert-sig"><div className="line" /><span>Principal</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
