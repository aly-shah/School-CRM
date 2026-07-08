"use client";
import { useEffect, useState } from "react";
import PortalShell from "@/components/PortalShell";
import ParentLogin from "@/components/ParentLogin";
import { getSession } from "@/lib/store";

export default function ParentGate({ children }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => { setAuthed(!!getSession()); setReady(true); }, []);

  if (!ready) return null; // avoid SSR/hydration flash
  if (!authed) return <ParentLogin onLogin={() => setAuthed(true)} />;
  return <PortalShell portal="parent">{children}</PortalShell>;
}
