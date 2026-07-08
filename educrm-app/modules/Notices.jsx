import { PageHeader, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { notices } from "@/lib/data";

const tagKind = { Event: "info", Fees: "warn", Academics: "good", Holiday: "mute" };

export default function Notices({ canPost = false }) {
  return (
    <>
      <PageHeader title="Notices & Announcements" subtitle="School-wide circulars and alerts">
        {canPost && <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>Post notice</button>}
      </PageHeader>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notices.map((n, i) => (
          <div key={i} className="card card-pad" style={{ display: "flex", gap: 14 }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, flex: "0 0 auto", display: "grid", placeItems: "center", background: `var(--${n.kind === "mute" ? "line-soft" : n.kind + "-bg"})`, color: `var(--${n.kind === "mute" ? "muted" : n.kind})` }}>
              <span style={{ display: "grid", placeItems: "center", width: 18, height: 18 }}>{I.megaphone}</span>
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                <b style={{ fontSize: 14.5 }}>{n.title}</b>
                <Pill kind={tagKind[n.tag] || "mute"}>{n.tag}</Pill>
                <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>{n.when}</span>
              </div>
              <div className="soft" style={{ fontSize: 13 }}>{n.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
