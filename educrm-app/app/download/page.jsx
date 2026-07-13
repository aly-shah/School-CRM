import { I } from "@/components/icons";

export const metadata = { title: "Get the EduCRM 360 app" };

export default function Download() {
  return (
    <div className="landing">
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div className="landing-brand" style={{ justifyContent: "center", width: "100%", marginBottom: 22 }}>
          <span className="logo">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
          </span>
          <b>EduCRM <span>360</span></b>
        </div>

        <div className="portal-card" style={{ ["--pa"]: "#5647E6", flexDirection: "column", alignItems: "stretch", gap: 18, padding: 26, cursor: "default" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#6d5efc,#4a3ad6)", display: "grid", placeItems: "center", margin: "0 auto 14px", boxShadow: "0 10px 24px -8px rgba(86,71,230,.6)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 750, letterSpacing: "-.02em", color: "var(--ink)" }}>EduCRM 360 for Android</h1>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>The full school CRM — all portals, in one app.</p>
          </div>

          <a href="/app.apk" className="btn primary" style={{ width: "100%", padding: "13px", fontSize: 15, justifyContent: "center" }}>
            <span style={{ display: "flex" }}>{I.download}</span>Download APK
          </a>

          <div style={{ background: "var(--panel-2)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            <b style={{ color: "var(--ink)" }}>How to install</b>
            <ol style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>Tap <b>Download APK</b> above.</li>
              <li>Open the downloaded file.</li>
              <li>If prompted, allow <b>“Install unknown apps”</b> for your browser, then tap <b>Install</b>.</li>
              <li>Open <b>EduCRM 360</b> and sign in.</li>
            </ol>
          </div>

          <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--muted)" }}>Android 7.0+ · iPhone users: open the site in Safari and “Add to Home Screen”.</div>
        </div>
      </div>
    </div>
  );
}
