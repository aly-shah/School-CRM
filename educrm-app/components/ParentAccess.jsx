"use client";
import { useEffect, useState } from "react";
import { getPassword, setPassword } from "@/lib/store";

export default function ParentAccess({ roll, name }) {
  const [pw, setPw] = useState("");
  const [existing, setExisting] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => { getPassword(roll).then((p) => { setExisting(p || ""); setPw(p || ""); }); }, [roll]);

  const save = async () => { await setPassword(roll, pw); setExisting(pw); setSaved(true); };

  return (
    <div className="card">
      <div className="card-h"><h3>Parent portal access</h3></div>
      <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div className="k2">Login roll number</div>
          <div className="v2 tnum">{roll}</div>
        </div>
        <div>
          <label className="k2" style={{ display: "block", marginBottom: 6 }}>Password</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={pw} onChange={(e) => { setPw(e.target.value); setSaved(false); }} placeholder="Set a password"
              style={{ flex: 1, minWidth: 0, padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13, fontFamily: "inherit" }} />
            <button className="btn primary" onClick={save} disabled={!pw} style={{ flex: "0 0 auto" }}>Save</button>
          </div>
        </div>
        {existing
          ? <span className="pill good" style={{ alignSelf: "flex-start" }}><span className="d" />Access active</span>
          : <span className="soft" style={{ fontSize: 12 }}>No password set yet.</span>}
        {saved && <div className="soft" style={{ fontSize: 12 }}>Share roll <b>{roll}</b> and this password with {name}'s parent.</div>}
      </div>
    </div>
  );
}
