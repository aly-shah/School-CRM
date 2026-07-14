// ---- Mock data for the EduCRM 360 frontend demo (no backend) ----

export const school = { name: "Springdale International School", session: "2025–26" };

export const initials = (name) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();

export const students = [
  { id: "2023-0142", name: "Ayaan Khan", grade: "6-B", roll: 12, gender: "Male", dob: "14 Aug 2013", blood: "B+", house: "Emerald", status: "Active", attendance: 96, overall: 87.6, grade_letter: "A", rank: 3, feeDue: 22500,
    parent: { name: "Mrs. Sana Khan", rel: "Mother", phone: "+92 321 4041785", email: "sana.khan@email.com" },
    father: { name: "Mr. Imran Khan", occ: "Business", phone: "+92 300 8433417" },
    address: "42 Rose Villa, Sector 8, Springdale",
    medical: "Mild dust allergy — inhaler kept with class teacher. No dietary restrictions.",
    sibling: "Zara Khan · Grade 3-A",
    subjects: [
      { name: "Mathematics", mark: 92, grade: "A+" },
      { name: "Computer", mark: 95, grade: "A+" },
      { name: "English", mark: 88, grade: "A" },
      { name: "Social Studies", mark: 84, grade: "A" },
      { name: "Science", mark: 79, grade: "B+" },
    ],
    fees: { annual: 180000, paid: 157500, due: 22500 },
  },
  { id: "2023-0088", name: "Zara Ahmed", grade: "6-B", roll: 5, gender: "Female", status: "Active", attendance: 98, overall: 91.2, grade_letter: "A+", rank: 1, feeDue: 0,
    parent: { name: "Mrs. Nadia Ahmed", rel: "Mother", phone: "+92 321 4455102" } },
  { id: "2022-0311", name: "Rehan Malik", grade: "8-A", roll: 21, gender: "Male", status: "Active", attendance: 88, overall: 74.5, grade_letter: "B", rank: 14, feeDue: 45000,
    parent: { name: "Mr. Adnan Malik", rel: "Father", phone: "+92 300 7712398" } },
  { id: "2024-0021", name: "Aisha Siddiqui", grade: "4-C", roll: 9, gender: "Female", status: "Active", attendance: 94, overall: 82.0, grade_letter: "A", rank: 6, feeDue: 0,
    parent: { name: "Mrs. Rabia Siddiqui", rel: "Mother", phone: "+92 333 5580174" } },
  { id: "2021-0190", name: "Bilal Nawaz", grade: "10-A", roll: 3, gender: "Male", status: "Active", attendance: 91, overall: 85.4, grade_letter: "A", rank: 4, feeDue: 22500,
    parent: { name: "Mr. Nawaz Ahmed", rel: "Father", phone: "+92 301 8823456" } },
  { id: "2023-0205", name: "Fatima Sheikh", grade: "6-A", roll: 17, gender: "Female", status: "Active", attendance: 79, overall: 68.9, grade_letter: "C+", rank: 22, feeDue: 67500,
    parent: { name: "Mr. Kashif Sheikh", rel: "Father", phone: "+92 345 6690231" } },
  { id: "2022-0402", name: "Hamza Tariq", grade: "8-B", roll: 11, gender: "Male", status: "Inactive", attendance: 62, overall: 59.0, grade_letter: "C", rank: 28, feeDue: 90000,
    parent: { name: "Mr. Tariq Mahmood", rel: "Father", phone: "+92 300 4471589" } },
  { id: "2024-0033", name: "Sara Nadeem", grade: "3-A", roll: 7, gender: "Female", status: "Active", attendance: 97, overall: 89.5, grade_letter: "A", rank: 2, feeDue: 0,
    parent: { name: "Mrs. Saima Nadeem", rel: "Mother", phone: "+92 322 7745120" } },
  { id: "2021-0075", name: "Usman Shah", grade: "10-B", roll: 19, gender: "Male", status: "Active", attendance: 85, overall: 77.8, grade_letter: "B+", rank: 9, feeDue: 22500,
    parent: { name: "Mr. Zulfiqar Shah", rel: "Father", phone: "+92 336 9902345" } },
  { id: "2023-0161", name: "Hira Yousaf", grade: "5-C", roll: 14, gender: "Female", status: "Active", attendance: 93, overall: 80.3, grade_letter: "A", rank: 8, feeDue: 0,
    parent: { name: "Mr. Yousaf Ali", rel: "Father", phone: "+92 302 6613478" } },
];

export const admissions = [
  { name: "Hassan Raza", grade: "Grade 5", stage: "Enquiry", source: "Website", date: "05 Jul", contact: "+92 321 4122334" },
  { name: "Amna Riaz", grade: "Grade 1", stage: "Enquiry", source: "Walk-in", date: "04 Jul", contact: "+92 321 4155221" },
  { name: "Danish Ali", grade: "Grade 7", stage: "Application", source: "Referral", date: "02 Jul", contact: "+92 321 4187654" },
  { name: "Rabia Sultana", grade: "Grade 3", stage: "Application", source: "Website", date: "01 Jul", contact: "+92 321 4134567" },
  { name: "Arsalan Khan", grade: "Grade 9", stage: "Visit", source: "Website", date: "30 Jun", contact: "+92 321 4176543" },
  { name: "Nimra Aslam", grade: "Grade 2", stage: "Offer", source: "Referral", date: "28 Jun", contact: "+92 321 4111223" },
  { name: "Komal Nadeem", grade: "Grade 6", stage: "Offer", source: "Walk-in", date: "27 Jun", contact: "+92 321 4199887" },
  { name: "Rohan Dar", grade: "Grade 4", stage: "Enrolled", source: "Website", date: "25 Jun", contact: "+92 321 4144556" },
];

export const admissionStages = ["Enquiry", "Application", "Visit", "Offer", "Enrolled"];

export const funnel = [
  { stage: "Enquiries", value: 120 },
  { stage: "Applications", value: 86 },
  { stage: "Visits", value: 61 },
  { stage: "Offers", value: 48 },
  { stage: "Enrolled", value: 39 },
];

export const feeMonths = [
  { m: "Feb", pct: 72 }, { m: "Mar", pct: 78 }, { m: "Apr", pct: 80 },
  { m: "May", pct: 84 }, { m: "Jun", pct: 88 }, { m: "Jul", pct: 95 },
];

export const defaulters = [
  { name: "Hamza Tariq", grade: "8-B", due: 90000, days: 41 },
  { name: "Fatima Sheikh", grade: "6-A", due: 67500, days: 22 },
  { name: "Rehan Malik", grade: "8-A", due: 45000, days: 12 },
  { name: "Ayaan Khan", grade: "6-B", due: 22500, days: 3 },
  { name: "Usman Shah", grade: "10-B", due: 22500, days: 3 },
];

export const staff = [
  { name: "Sadia Karim", role: "Class Teacher · 6-B", dept: "Academics", phone: "+92 300 8422334", status: "On duty" },
  { name: "Kamran Ali", role: "Maths, Grades 8–10", dept: "Academics", phone: "+92 300 8455667", status: "On duty" },
  { name: "Farah Naeem", role: "Accountant", dept: "Finance", phone: "+92 300 8488990", status: "On duty" },
  { name: "Rashid Mehmood", role: "Transport In-charge", dept: "Operations", phone: "+92 300 8433445", status: "On leave" },
  { name: "Nadia Aslam", role: "Science, Grades 6–8", dept: "Academics", phone: "+92 300 8477889", status: "On duty" },
  { name: "Tariq Javed", role: "Admin Head", dept: "Administration", phone: "+92 300 8400112", status: "On duty" },
];

export const classRoster = [
  { roll: 1, name: "Ahmed Raza", present: true },
  { roll: 2, name: "Ayesha Noor", present: true },
  { roll: 3, name: "Farhan Ali", present: true },
  { roll: 4, name: "Iqra Jamil", present: false },
  { roll: 5, name: "Zara Ahmed", present: true },
  { roll: 6, name: "Kashif Iqbal", present: true },
  { roll: 7, name: "Laiba Tariq", present: true },
  { roll: 8, name: "Noman Shah", present: false },
  { roll: 9, name: "Hania Malik", present: true },
  { roll: 10, name: "Rayan Dawood", present: true },
  { roll: 11, name: "Sana Rizwan", present: true },
  { roll: 12, name: "Ayaan Khan", present: true },
];

export const timetable = {
  periods: ["8:00", "8:50", "9:40", "10:50", "11:40", "12:30"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  grid: [
    ["Maths", "English", "Science", "Computer", "Social", "Hindi"],
    ["English", "Maths", "Computer", "Science", "Hindi", "Art"],
    ["Science", "Social", "Maths", "English", "Computer", "PE"],
    ["Computer", "Science", "English", "Maths", "Art", "Social"],
    ["Social", "Hindi", "PE", "English", "Maths", "Library"],
  ],
};

export const subjectColor = {
  Maths: "#5647E6", English: "#1f9d5b", Science: "#3f74d6", Computer: "#c8890c",
  Social: "#d84a4a", Hindi: "#8b5cf6", Art: "#ec4899", PE: "#0ea5a4", Library: "#64748b",
};

export const timetableDays = timetable.days;
export const timetablePeriods = timetable.periods;
export const subjects = ["Maths", "English", "Science", "Computer", "Social", "Hindi", "Art", "PE", "Library"];

export const classesSeed = [
  { id: "6-B", name: "Grade 6-B", teacher: "Sadia Karim", room: "R-104", students: 32, grid: timetable.grid },
  { id: "8-A", name: "Grade 8-A", teacher: "Kamran Ali", room: "R-210", students: 29, grid: [
    ["English", "Maths", "Science", "Social", "Computer", "PE"],
    ["Maths", "Science", "English", "Computer", "Hindi", "Library"],
    ["Science", "English", "Social", "Maths", "Art", "Computer"],
    ["Social", "Computer", "Maths", "Science", "English", "Hindi"],
    ["Computer", "Maths", "English", "PE", "Science", "Social"],
  ] },
  { id: "10-A", name: "Grade 10-A", teacher: "Nadia Aslam", room: "R-305", students: 26, grid: [
    ["Maths", "Science", "English", "Computer", "Social", "Library"],
    ["Science", "Maths", "Computer", "English", "Hindi", "PE"],
    ["English", "Computer", "Maths", "Science", "Social", "Art"],
    ["Computer", "English", "Science", "Maths", "PE", "Social"],
    ["Social", "Maths", "English", "Computer", "Science", "Hindi"],
  ] },
];

export const exams = [
  { name: "Term 2 Examination", cls: "All grades", status: "Results published", date: "Jun 2025" },
  { name: "Unit Test 3", cls: "Grades 6–10", status: "Marks entry open", date: "Jul 2025" },
  { name: "Term 1 Examination", cls: "All grades", status: "Results published", date: "Dec 2024" },
];

export const pkr = (n) => "Rs " + n.toLocaleString("en-PK");

// ---- Teacher ----
export const teacherClasses = [
  { cls: "6-B", subject: "Mathematics", students: 32, room: "R-104", next: "8:00" },
  { cls: "8-A", subject: "Mathematics", students: 29, room: "R-210", next: "9:40" },
  { cls: "10-A", subject: "Mathematics", students: 26, room: "R-305", next: "11:40" },
];

export const gradebook = [
  { roll: 1, name: "Ahmed Raza", marks: 78 },
  { roll: 2, name: "Ayesha Noor", marks: 91 },
  { roll: 3, name: "Farhan Ali", marks: 66 },
  { roll: 4, name: "Iqra Jamil", marks: 84 },
  { roll: 5, name: "Zara Ahmed", marks: 95 },
  { roll: 6, name: "Kashif Iqbal", marks: 72 },
  { roll: 12, name: "Ayaan Khan", marks: 92 },
];

export const homework = [
  { subject: "Mathematics", title: "Exercise 7.2 — Linear equations", cls: "6-B", due: "Tomorrow", status: "Open" },
  { subject: "Science", title: "Lab report: Photosynthesis", cls: "6-B", due: "Fri", status: "Open" },
  { subject: "English", title: "Essay: My favourite book", cls: "6-B", due: "Mon", status: "Graded" },
  { subject: "Computer", title: "Scratch animation project", cls: "6-B", due: "Next week", status: "Open" },
];

// ---- Notices / announcements ----
export const notices = [
  { title: "Parent-Teacher Meeting", body: "PTM for all grades this Friday, 10 AM in the main hall.", when: "2h ago", kind: "info", tag: "Event" },
  { title: "Term 2 fees due 15 July", body: "Kindly clear pending dues before the deadline to avoid late charges.", when: "1d ago", kind: "warn", tag: "Fees" },
  { title: "Report cards published", body: "Term 2 results are now available in the parent app.", when: "28 Jun", kind: "good", tag: "Academics" },
  { title: "Independence Day holiday", body: "School will remain closed on 14 August.", when: "26 Jun", kind: "mute", tag: "Holiday" },
];

// ---- Finance ----
export const expenses = [
  { head: "Salaries & payroll", amount: 12000000, cat: "Staff" },
  { head: "Utilities (electricity, water)", amount: 640000, cat: "Operations" },
  { head: "Transport & fuel", amount: 480000, cat: "Transport" },
  { head: "Lab & library supplies", amount: 315000, cat: "Academics" },
  { head: "Building maintenance", amount: 270000, cat: "Operations" },
];

export const payroll = [
  { name: "Sadia Karim", role: "Class Teacher", gross: 145000, status: "Processed" },
  { name: "Kamran Ali", role: "Sr. Maths Teacher", gross: 168000, status: "Processed" },
  { name: "Farah Naeem", role: "Accountant", gross: 132000, status: "Processed" },
  { name: "Rashid Mehmood", role: "Transport In-charge", gross: 96000, status: "Pending" },
  { name: "Nadia Aslam", role: "Science Teacher", gross: 138000, status: "Processed" },
];

// ---- Driver / Transport ----
export const routes = [
  { id: "R-1", name: "Route 1 · North Loop", bus: "LEB-4471", driver: "Rashid Mehmood", stops: 8, students: 22 },
];

export const manifest = [
  { stop: "Sector 8 — Rose Villa", time: "6:55", student: "Ayaan Khan", grade: "6-B", status: "Pending" },
  { stop: "Sector 8 — Green Court", time: "6:58", student: "Zara Ahmed", grade: "6-B", status: "Pending" },
  { stop: "Sector 7 — Mall Road", time: "7:05", student: "Rehan Malik", grade: "8-A", status: "Pending" },
  { stop: "Sector 7 — Park Lane", time: "7:09", student: "Fatima Sheikh", grade: "6-A", status: "Pending" },
  { stop: "Sector 5 — Civic Centre", time: "7:16", student: "Usman Shah", grade: "10-B", status: "Pending" },
  { stop: "Sector 5 — Lake View", time: "7:20", student: "Aisha Siddiqui", grade: "4-C", status: "Pending" },
];

// ---- Staff self-service ----
export const leaveRequests = [
  { type: "Casual leave", from: "12 Jul", to: "13 Jul", days: 2, status: "Approved" },
  { type: "Sick leave", from: "28 Jun", to: "28 Jun", days: 1, status: "Approved" },
  { type: "Casual leave", from: "20 Jul", to: "21 Jul", days: 2, status: "Pending" },
];

export const payslips = [
  { month: "June 2025", gross: 145000, net: 131200, status: "Paid" },
  { month: "May 2025", gross: 145000, net: 131200, status: "Paid" },
  { month: "April 2025", gross: 142000, net: 128600, status: "Paid" },
];

// ---- Principal / approvals ----
// ---- Events (parent calendar) ----
export const eventMonth = { name: "July 2026", firstDow: 3, days: 31, today: 6 };
export const events = [
  { day: 6, title: "Today", time: "", type: "Today" },
  { day: 10, title: "Parent–Teacher Meeting", time: "10:00 AM", type: "Meeting" },
  { day: 12, title: "Science Fair", time: "9:00 AM", type: "Event" },
  { day: 15, title: "Term 2 fees due", time: "All day", type: "Fees" },
  { day: 18, title: "Sports Day", time: "8:30 AM", type: "Sports" },
  { day: 22, title: "Art Exhibition", time: "11:00 AM", type: "Event" },
  { day: 25, title: "Half-yearly result day", time: "9:00 AM", type: "Academics" },
];
// deterministic attendance status for the demo month (shared by teacher & student views)
export function attStatus(roll, day) {
  const h = (roll * 13 + day * 7) % 29;
  if (h === 0 || h === 5) return "A";
  if (h === 11) return "L";
  return "P";
}
export function isJulSunday(day) { return ((eventMonth.firstDow + day - 1) % 7) === 0; }

export const eventType = {
  Today: "var(--muted)", Meeting: "var(--accent)", Event: "var(--info)",
  Fees: "var(--warn)", Sports: "var(--good)", Academics: "#7c3aed",
};

export const approvals = [
  { kind: "Fee discount", detail: "20% sibling discount — Zara Khan (3-A)", by: "Accountant", when: "1h ago" },
  { kind: "Staff leave", detail: "Rashid Mehmood — 2 days casual leave", by: "HR", when: "3h ago" },
  { kind: "Admission offer", detail: "Komal Nadeem — Grade 6 seat", by: "Admissions", when: "5h ago" },
  { kind: "Expense", detail: "Library restock — Rs 85,000", by: "Finance", when: "Yesterday" },
];
