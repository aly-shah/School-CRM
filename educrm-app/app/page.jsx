import Link from "next/link";
import { I } from "@/components/icons";
import { PORTAL_LIST } from "@/lib/portals";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-inner">
        <header className="landing-head">
          <div className="landing-brand">
            <span className="logo">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" />
              </svg>
            </span>
            <b>EduCRM <span>360</span></b>
          </div>
          <h1>One platform. Seven portals.</h1>
          <p>Everyone in the school gets a tailored experience — pick a portal to explore the demo.</p>
        </header>

        <div className="portal-grid">
          {PORTAL_LIST.map((p) => (
            <Link key={p.id} href={`/${p.id}`} className="portal-card" style={{ ["--pa"]: p.accent }}>
              <span className="pc-icon" style={{ background: p.accent + "1a", color: p.accent }}>{I[p.nav[0].icon]}</span>
              <div className="pc-body">
                <div className="pc-name">{p.name} portal</div>
                <div className="pc-tag">{p.tagline}</div>
              </div>
              <span className="pc-go" style={{ color: p.accent }}>{I.swap}</span>
            </Link>
          ))}
        </div>

        <footer className="landing-foot">Frontend demo · mock data · no login required — every portal opens directly.</footer>
      </div>
    </div>
  );
}
