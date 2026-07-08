import { initials } from "@/lib/data";

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="ph">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="acts">{children}</div>}
    </div>
  );
}

export function Card({ title, link, children, pad = true, style }) {
  return (
    <div className="card" style={style}>
      {title && (
        <div className="card-h">
          <h3>{title}</h3>
          {link && <a className="link" href="#">{link}</a>}
        </div>
      )}
      {pad ? <div className="card-pad">{children}</div> : children}
    </div>
  );
}

export function StatTile({ label, icon, tint, value, sub }) {
  return (
    <div className="tile">
      <div className="lab">
        {icon && <span className="ti" style={{ background: tint?.bg }}>
          <span style={{ display: "grid", placeItems: "center", color: tint?.fg }}>{icon}</span>
        </span>}
        {label}
      </div>
      <div className="big tnum">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

export function Pill({ kind = "mute", dot, children }) {
  return <span className={`pill ${kind}`}>{dot && <span className="d" />}{children}</span>;
}

export function Avatar({ name, size = 36, radius, fs }) {
  return (
    <span className={`av ${radius ? "sq" : ""}`} style={{ width: size, height: size, fontSize: fs || Math.round(size * 0.36) }}>
      {initials(name)}
    </span>
  );
}

export function Bar({ pct, color = "var(--accent)" }) {
  return <div className="bar-el"><i style={{ width: `${pct}%`, background: color }} /></div>;
}

// Simple SVG donut
export function Donut({ pct, color = "var(--accent)", size = 104, label, value }) {
  const r = 42, c = 2 * Math.PI * r, dash = (pct / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <svg width={size} height={size} viewBox="0 0 104 104">
        <circle cx="52" cy="52" r={r} fill="none" stroke="var(--line-soft)" strokeWidth="12" />
        <circle cx="52" cy="52" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${dash.toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 52 52)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <b className="tnum" style={{ fontSize: 20, fontWeight: 750, letterSpacing: "-.02em" }}>{value ?? `${pct}%`}</b>
        {label && <span style={{ fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</span>}
      </div>
    </div>
  );
}

export const gradeClass = (g) =>
  g?.startsWith("A") ? "good" : g?.startsWith("B") ? "info" : "warn";

// Responsive table: normal table on desktop, stacked label/value cards on phones.
// cols: [{ key?, label, align?: 'r', render?: (row, i) => node }]
export function Table({ cols, rows, empty, minWidth = 560, footer }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl" style={{ minWidth }}>
        <thead>
          <tr>{cols.map((c, i) => <th key={i} className={c.align === "r" ? "r" : ""}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty && (
            <tr><td colSpan={cols.length} className="tbl-empty">{empty}</td></tr>
          )}
          {rows.map((row, ri) => (
            <tr key={row.id ?? ri}>
              {cols.map((c, ci) => (
                <td key={ci} className={c.align === "r" ? "r" : ""} data-label={c.label}>
                  {c.render ? c.render(row, ri) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {footer && (
            <tr><td colSpan={cols.length} className="tbl-empty">{footer}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
