"use client";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui";
import { I } from "@/components/icons";
import { getTeachers } from "@/lib/store";
import { classTeacherFor } from "@/lib/classes";

// Shows the class teacher for a given section (grade), e.g. on the student portal.
export default function ClassTeacherCard({ grade }) {
  const [t, setT] = useState(undefined); // undefined = loading, null = none

  useEffect(() => {
    getTeachers().then((all) => setT(classTeacherFor(all, grade) || null)).catch(() => setT(null));
  }, [grade]);

  return (
    <div className="card card-pad">
      <div className="soft" style={{ fontSize: 12.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", marginBottom: 12 }}>
        Your class teacher
      </div>
      {t === undefined && <div className="soft" style={{ fontSize: 13 }}>Loading…</div>}
      {t === null && <div className="soft" style={{ fontSize: 13 }}>No class teacher assigned for {grade} yet.</div>}
      {t && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {t.photo
            ? <img src={t.photo} alt={t.name} style={{ width: 56, height: 56, borderRadius: 15, objectFit: "cover", flex: "0 0 auto" }} />
            : <Avatar name={t.name} size={56} radius fs={20} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</div>
            <div className="soft" style={{ fontSize: 13 }}>{t.subject || "Class teacher"} · teaches {grade}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12.5, color: "var(--muted)" }}>
              <span style={{ display: "grid", placeItems: "center", width: 15, height: 15 }}>{I.staff}</span>Class teacher
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
