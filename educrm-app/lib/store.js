// Client API wrapper — talks to /api (Postgres). Only the parent session
// stays in localStorage (it's a client-side login token).

async function jget(url) { const r = await fetch(url); return r.json(); }
async function jsend(url, method, body) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

// ---- students ----
export const getStudents = () => jget("/api/students");
export const getStudent = (id) => jget(`/api/students/${encodeURIComponent(id)}`);
export async function addStudent(s) {
  const { ok, data } = await jsend("/api/students", "POST", s);
  if (!ok) throw new Error(data.error || "Failed to add student");
  return data;
}
export async function setPhoto(id, dataURL) { await jsend(`/api/students/${encodeURIComponent(id)}`, "PATCH", { photo: dataURL }); }
export async function getPhoto(id) { const s = await getStudent(id); return s?.photo || null; }

// ---- staff ----
export const getStaff = () => jget("/api/staff");
export async function addStaff(m) { const { data } = await jsend("/api/staff", "POST", m); return data; }

// ---- drivers ----
export const getDrivers = () => jget("/api/drivers");
export async function addDriver(d) { const { ok, data } = await jsend("/api/drivers", "POST", d); if (!ok) throw new Error(data.error || "Failed"); return data; }
export async function setDriverPhoto(id, dataURL) { await jsend(`/api/drivers/${id}`, "PATCH", { photo: dataURL }); }

// ---- teachers (accounts created by admin) ----
export const getTeachers = () => jget("/api/teachers");
export async function addTeacher(t) { const { ok, data } = await jsend("/api/teachers", "POST", t); if (!ok) throw new Error(data.error || "Failed"); return data; }
export async function setTeacherPhoto(id, dataURL) { await jsend(`/api/teachers/${id}`, "PATCH", { photo: dataURL }); }
export async function teacherLogin(username, password) {
  const { data } = await jsend("/api/teachers/login", "POST", { username, password });
  if (data.ok) setTeacherSession(data.teacher);
  return !!data.ok;
}
const K_TSESSION = "educrm_teacher_session";
export function setTeacherSession(t) { if (typeof window !== "undefined") localStorage.setItem(K_TSESSION, JSON.stringify(t)); }
export function getTeacherSession() {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(K_TSESSION); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function teacherLogout() { if (typeof window !== "undefined") localStorage.removeItem(K_TSESSION); }

// ---- vehicle safety checklist ----
export const getVehicleCheck = (bus) => jget(`/api/vehicle-checks?bus=${encodeURIComponent(bus)}`);
export const getVehicleChecks = () => jget(`/api/vehicle-checks`);
export async function submitVehicleCheck(d) { const { data } = await jsend("/api/vehicle-checks", "POST", d); return data; }

// ---- classes / timetables ----
export const getClasses = () => jget("/api/classes");
export async function addClass(c) { const { ok, data } = await jsend("/api/classes", "POST", c); if (!ok) throw new Error(data.error || "Failed"); return data; }
export async function updateClassGrid(id, grid) { await jsend(`/api/classes/${encodeURIComponent(id)}`, "PATCH", { grid }); }

// ---- homework ----
export const getHomework = () => jget("/api/homework");
export async function addHomework(item) { const { data } = await jsend("/api/homework", "POST", item); return data; }
export async function submitHomework(id, roll = "12") { await jsend("/api/homework/submit", "POST", { id, roll }); }

// ---- quizzes ----
export const getQuizzes = () => jget("/api/quizzes");
export async function addQuiz(z) { const { data } = await jsend("/api/quizzes", "POST", z); return data; }
export const getQuizResults = (roll) => jget(`/api/quiz-results${roll ? `?roll=${roll}` : ""}`);
export async function addQuizResult(r) { await jsend("/api/quiz-results", "POST", r); }

// ---- chat ----
export const getMessages = (thread = "12") => jget(`/api/messages?thread=${thread}`);
export async function addMessage(thread, msg) { await jsend("/api/messages", "POST", { thread, ...msg }); }

// ---- payments ----
export const getPayment = (roll) => jget(`/api/payments?roll=${roll}`);
export async function isPaid(roll) { return !!(await getPayment(roll)); }
export async function setPaid(roll, payment) { await jsend("/api/payments", "POST", { roll, ...payment }); }

// ---- parent credentials + login ----
export const getPassword = async (roll) => (await jget(`/api/parent/creds?roll=${roll}`)).password;
export async function setPassword(roll, password) { await jsend("/api/parent/creds", "POST", { roll, password }); }
export async function login(roll, password) {
  const { data } = await jsend("/api/parent/login", "POST", { roll, password });
  if (data.ok) setSession(roll);
  return !!data.ok;
}

// ---- certificates ----
export const getCertificates = (roll) => jget(`/api/certificates${roll ? `?roll=${roll}` : ""}`);
export async function addCertificate(c) { const { data } = await jsend("/api/certificates", "POST", c); return data; }

// ---- library ----
export const getBooks = () => jget("/api/library/books");
export async function addBook(b) { const { data } = await jsend("/api/library/books", "POST", b); return data; }
export const getLoans = () => jget("/api/library/loans");
export async function issueBook(l) { const { ok, data } = await jsend("/api/library/loans", "POST", l); if (!ok) throw new Error(data.error || "Failed"); return data; }
export async function returnBook(id) { await jsend("/api/library/loans", "PATCH", { id }); }

// ---- inventory ----
export const getInventory = () => jget("/api/inventory");
export async function addInventory(i) { const { data } = await jsend("/api/inventory", "POST", i); return data; }
export async function adjustInventory(id, delta) { await jsend("/api/inventory", "POST", { id, delta }); }

// ---- notifications (scoped by student roll, or by staff portal audience) ----
export const getNotifications = (t = {}) =>
  jget(`/api/notifications?${t.roll ? `roll=${t.roll}` : `audience=${t.audience || ""}`}`);
export async function markNotificationsRead(t = {}) {
  await jsend("/api/notifications", "PATCH", t.roll ? { roll: t.roll } : { audience: t.audience });
}

// ---- fee reminders (files an in-app notification for each student + their parent) ----
export async function remindFees(items) {
  const { data } = await jsend("/api/fees/remind", "POST", { items });
  return data?.sent || 0;
}

// ---- parent session (client-only token) ----
const K_SESSION = "educrm_parent_session";
export function setSession(roll) { if (typeof window !== "undefined") localStorage.setItem(K_SESSION, JSON.stringify(String(roll))); }
export function getSession() {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(K_SESSION); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function logout() { if (typeof window !== "undefined") localStorage.removeItem(K_SESSION); }
