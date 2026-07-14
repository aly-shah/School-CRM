// A teacher's `classes` field is a free string like "6-B, 8-A, 10-A".
export function parseClasses(str) {
  return String(str || "")
    .split(/[,/]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function firstClass(str, fallback = "6-B") {
  return parseClasses(str)[0] || fallback;
}

// Does this teacher teach the given class/section?
export function teachesClass(teacher, grade) {
  if (!teacher || !grade) return false;
  return parseClasses(teacher.classes).includes(grade);
}

// The class teacher for a section = first teacher whose classes include it.
export function classTeacherFor(teachers, grade) {
  return (teachers || []).find((t) => teachesClass(t, grade)) || null;
}
