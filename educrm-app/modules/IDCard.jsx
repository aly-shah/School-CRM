"use client";
import { I } from "@/components/icons";
import { initials } from "@/lib/data";

export default function IDCard({ s, photo }) {
  const parent = s.parent || {};
  return (
    <>
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div className="soft" style={{ fontSize: 13, marginRight: "auto" }}>Preview — front &amp; back</div>
        <button className="btn primary" onClick={() => window.print()}>{I.print}Print ID card</button>
      </div>

      <div className="idcard-print">
        <div className="idcard-wrap">
          {/* -------- FRONT -------- */}
          <div className="idcard">
            <div className="idcard-top">
              <span className="logo" style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(255,255,255,.2)", display: "grid", placeItems: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
              </span>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>Springdale International</div>
                <div style={{ fontSize: 8.5, opacity: 0.85, letterSpacing: ".08em" }}>STUDENT IDENTITY CARD</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 9, opacity: 0.9 }}>2025–26</span>
            </div>

            <div style={{ display: "flex", gap: 12, padding: "12px 14px 0" }}>
              {photo
                ? <img src={photo} alt={s.name} className="idcard-photo" style={{ objectFit: "cover" }} />
                : <div className="idcard-photo">{initials(s.name)}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 750, letterSpacing: "-.01em", lineHeight: 1.15 }}>{s.name}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 6 }}>Student</div>
                <Field k="Class" v={`Grade ${s.grade}`} />
                <Field k="Roll No." v={s.roll} />
                <Field k="Adm #" v={s.id} />
                <Field k="Blood" v={s.blood || "—"} />
              </div>
            </div>

            <div className="idcard-foot">
              <div className="idcard-barcode" />
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 78, borderTop: "1px solid var(--ink)", marginBottom: 3 }} />
                <span style={{ fontSize: 8, color: "var(--muted)" }}>Principal</span>
              </div>
            </div>
          </div>

          {/* -------- BACK -------- */}
          <div className="idcard">
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Springdale International School</div>
              <Field k="Guardian" v={parent.name || "—"} back />
              <Field k="Contact" v={parent.phone || "—"} back />
              <Field k="Address" v={s.address || "On file"} back />
              <Field k="House" v={s.house || "—"} back />
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 16, right: 16 }}>
              <p style={{ fontSize: 8.5, color: "var(--muted)", lineHeight: 1.5, margin: "0 0 8px" }}>
                This card is the property of Springdale International School. If found, please return to the school office. Not transferable.
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div className="idcard-barcode" />
                <span className="tnum" style={{ fontSize: 9, color: "var(--muted)" }}>{s.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ k, v, back }) {
  return (
    <div style={{ display: "flex", gap: 6, fontSize: back ? 11 : 10.5, marginBottom: back ? 7 : 2.5 }}>
      <span style={{ width: back ? 66 : 46, color: "var(--muted)", flex: "0 0 auto" }}>{k}</span>
      <b style={{ fontWeight: 600, wordBreak: "break-word" }}>{v}</b>
    </div>
  );
}
