"use client";
import { useEffect, useState } from "react";
import Results from "@/modules/Results";
import { getSession } from "@/lib/store";

export default function Page() {
  const [roll, setRoll] = useState("12");
  useEffect(() => { setRoll(getSession() || "12"); }, []);
  return <Results roll={roll} />;
}
