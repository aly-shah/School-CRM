"use client";
import { useState } from "react";
import Link from "next/link";
import { I } from "@/components/icons";
import { login } from "@/lib/store";

export default function ParentLogin({ onLogin }) {
  const [roll, setRoll] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(roll, pw);
    if (ok) onLogin();
    else setErr("Incorrect roll number or password. Contact the school office if you need access.");
  };

  return (
    <div className="landing" style={{ ["--pa"]: "#0d9488" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="landing-brand" style={{ justifyContent: "center", width: "100%", marginBottom: 20 }}>
          <span className="logo" style={{ background: "linear-gradient(135deg,#14b8a6,#0d9488)" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
          </span>
          <b>EduCRM <span>360</span></b>
        </div>

        <form onSubmit={submit} style={{ background: "#fff", borderRadius: 16, padding: 26 }}>
          <div style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, background: "#0d94881a", color: "#0d9488", margin: "0 auto 14px" }}>
            <span style={{ display: "grid", placeItems: "center", width: 22, height: 22 }}>{I.parents}</span>
          </div>
          <h2 style={{ textAlign: "center", margin: "0 0 4px", fontSize: 20, fontWeight: 750, color: "#1d2130" }}>Parent sign in</h2>
          <p style={{ textAlign: "center", margin: "0 0 20px", fontSize: 13, color: "#5b6070" }}>Use your child's roll number and the password from the school.</p>

          <label style={lbl}>Child's roll number</label>
          <input value={roll} onChange={(e) => { setRoll(e.target.value); setErr(""); }} placeholder="e.g. 12" style={inp} />

          <label style={lbl}>Password</label>
          <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} placeholder="••••••••" style={inp} />

          {err && <div style={{ color: "#d84a4a", fontSize: 12.5, marginBottom: 12 }}>{err}</div>}

          <button type="submit" className="btn primary" style={{ width: "100%", background: "#0d9488", borderColor: "#0d9488", marginBottom: 12 }}>{I.lock}Sign in</button>

          <div style={{ fontSize: 12, color: "#8b90a0", textAlign: "center", background: "#f5f6f9", borderRadius: 8, padding: "8px 10px" }}>
            Demo login → roll <b>12</b> · password <b>ayaan2025</b>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ color: "#9aa0c4", fontSize: 12.5 }}>← All portals</Link>
        </div>
      </div>
    </div>
  );
}

const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: "#5b6070", marginBottom: 6 };
const inp = { width: "100%", padding: "10px 12px", border: "1px solid #e6e8ee", borderRadius: 9, fontSize: 14, fontFamily: "inherit", marginBottom: 14, boxSizing: "border-box" };
