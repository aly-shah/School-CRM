"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import FeeVoucher from "@/modules/FeeVoucher";
import { students } from "@/lib/data";
import { getSession } from "@/lib/store";

export default function Page() {
  const [child, setChild] = useState(students[0]);
  useEffect(() => {
    const roll = getSession();
    const found = students.find((s) => String(s.roll) === String(roll));
    if (found) setChild(found);
  }, []);
  return (
    <>
      <div className="no-print"><PageHeader title="Fee voucher" subtitle={`${child.name} · Term 2 · 2025–26`} /></div>
      <FeeVoucher studentId={child.id} />
    </>
  );
}
