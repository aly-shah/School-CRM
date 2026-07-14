"use client";
import { useEffect, useState } from "react";
import PortalShell from "@/components/PortalShell";
import TeacherLogin from "@/components/TeacherLogin";
import { getTeacherSession } from "@/lib/store";

const initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

export default function TeacherGate({ children }) {
  const [ready, setReady] = useState(false);
  const [t, setT] = useState(null);

  useEffect(() => { setT(getTeacherSession()); setReady(true); }, []);

  if (!ready) return null;
  if (!t) return <TeacherLogin onLogin={() => setT(getTeacherSession())} />;

  const user = { name: t.name, sub: t.subject || "Class Teacher", initials: initials(t.name), photo: t.photo };
  return <PortalShell portal="teacher" userOverride={user}>{children}</PortalShell>;
}
