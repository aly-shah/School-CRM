"use client";
import { logout } from "@/lib/store";
import { I } from "@/components/icons";

export default function SignOutButton() {
  const out = () => { logout(); window.location.href = "/parent"; };
  return <button className="btn" onClick={out}>{I.logout}Sign out</button>;
}
