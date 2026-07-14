"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { I } from "@/components/icons";
import { PORTALS } from "@/lib/portals";
import NotificationBell from "@/components/NotificationBell";

const ChevL = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg>;
const ChevR = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>;

export default function PortalShell({ portal, children, userOverride }) {
  const cfg = PORTALS[portal];
  const user = userOverride || cfg.user;
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("educrm_sidebar_collapsed");
    if (saved !== null) setCollapsed(saved === "1");
    else if (window.innerWidth < 900) setCollapsed(true);
  }, []);
  const toggle = () => setCollapsed((c) => { const n = !c; localStorage.setItem("educrm_sidebar_collapsed", n ? "1" : "0"); return n; });

  const home = `/${cfg.id}`;
  const active = (href) => (href === home ? path === href : path === href || path.startsWith(href + "/"));
  const title = cfg.nav.find((n) => active(n.href))?.label || cfg.name;

  // bottom nav (mobile): show up to 5 items, or 4 + "More"
  const showMore = cfg.nav.length > 5;
  const primary = showMore ? cfg.nav.slice(0, 4) : cfg.nav;
  const moreActive = showMore && cfg.nav.slice(4).some((n) => active(n.href));

  return (
    <div className="app" style={{ gridTemplateColumns: `${collapsed ? 78 : 236}px 1fr`, ["--accent"]: cfg.accent, ["--accent-weak"]: cfg.accent + "1f", ["--accent-ink"]: cfg.accent }}>
      <aside className={`side ${collapsed ? "collapsed" : ""}`}>
        <div className="rail-top">
          <Link href="/" className="rail-logo" data-label="All portals">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M7 10v5c0 1 5 3 5 3s5-2 5-3v-5" /></svg>
          </Link>
          <div className="rail-brand"><b>EduCRM 360</b><span>{cfg.name} portal</span></div>
          <button className="rail-toggle" onClick={toggle} aria-label="Toggle sidebar" title={collapsed ? "Expand" : "Collapse"}>{collapsed ? ChevR : ChevL}</button>
        </div>

        <nav className="rail-nav">
          {cfg.nav.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-i ${active(n.href) ? "active" : ""}`} data-label={n.label}>
              <span className="ni-ic">{I[n.icon]}</span><span className="ni-lb">{n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="rail-bottom">
          <Link href="/" className="nav-i" data-label="Switch portal">
            <span className="ni-ic">{I.swap}</span><span className="ni-lb">Switch portal</span>
          </Link>
          <div className="rail-user">
            {user.photo
              ? <img src={user.photo} alt={user.name} className="rail-av" style={{ objectFit: "cover" }} />
              : <div className="rail-av" style={{ background: cfg.accent }}>{user.initials}</div>}
            <div className="ru-info"><div className="ru-nm">{user.name}</div><div className="ru-rl">{user.sub}</div></div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="tb-title">{title}</div>
            <div className="tb-sub">{cfg.name} portal · {cfg.user.name}</div>
          </div>
          <div className="search">
            {I.search}
            <input placeholder="Search…" aria-label="Search" />
          </div>
          <NotificationBell portal={cfg.id} />
        </div>
        <div className="content">{children}</div>
      </div>

      {/* mobile bottom navigation */}
      <nav className="bottomnav">
        {primary.map((n) => (
          <Link key={n.href} href={n.href} className={`bn-i ${active(n.href) ? "active" : ""}`}>
            {I[n.icon]}<span>{n.label}</span>
          </Link>
        ))}
        {showMore && (
          <button className={`bn-i ${moreActive ? "active" : ""}`} onClick={() => setMoreOpen(true)}>
            {I.grid}<span>More</span>
          </button>
        )}
      </nav>

      {moreOpen && (
        <>
          <div className="more-overlay" onClick={() => setMoreOpen(false)} />
          <div className="more-sheet">
            <div className="grip" />
            <div className="more-grid">
              {cfg.nav.map((n) => (
                <Link key={n.href} href={n.href} className={active(n.href) ? "active" : ""} onClick={() => setMoreOpen(false)}>
                  {I[n.icon]}<span>{n.label}</span>
                </Link>
              ))}
              <Link href="/" onClick={() => setMoreOpen(false)}>{I.swap}<span>Switch portal</span></Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
