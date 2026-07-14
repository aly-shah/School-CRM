"use client";
import { useEffect, useRef, useState } from "react";
import { I } from "@/components/icons";
import { getNotifications, markNotificationsRead, getSession, getTeacherSession } from "@/lib/store";

export default function NotificationBell({ portal }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const ref = useRef(null);

  const target = () => {
    if (portal === "parent") return { roll: getSession() };
    if (portal === "student") return { roll: "12" };
    if (portal === "teacher") return { audience: "teacher", tid: getTeacherSession()?.id };
    return { audience: portal };
  };

  const load = () => getNotifications(target()).then(setList).catch(() => {});
  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [portal]);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = list.filter((n) => !n.read).length;
  const toggle = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && unread) { await markNotificationsRead(target()); setList((l) => l.map((n) => ({ ...n, read: true }))); }
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="icon-btn" aria-label="Notifications" onClick={toggle}>
        {unread > 0 && <span className="badge">{unread > 9 ? "9+" : unread}</span>}
        {I.bell}
      </button>
      {open && (
        <div className="notif-drop">
          <div className="notif-head">Notifications</div>
          {list.length === 0 && <div className="notif-empty">Nothing yet — activity will show up here.</div>}
          {list.map((n) => (
            <div key={n.id} className="notif-item">
              <span className="notif-dot" style={{ background: n.kind === "mute" ? "var(--muted)" : `var(--${n.kind})` }} />
              <div><div className="notif-t">{n.title}</div><div className="notif-b">{n.body}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
