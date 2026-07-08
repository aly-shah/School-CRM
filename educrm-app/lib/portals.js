// ------------------------------------------------------------------
// Portal registry — the single source of truth for every portal.
// Add / rename a portal or change its nav here; nothing else to touch.
// `icon` values are keys into components/icons.jsx (the `I` map).
// ------------------------------------------------------------------

export const PORTALS = {
  admin: {
    id: "admin", name: "Admin", role: "Administrator",
    tagline: "Run the whole school — every module in one place.",
    accent: "#5647E6",
    user: { name: "R. Ahmed", sub: "Administrator", initials: "RA" },
    nav: [
      { label: "Dashboard", href: "/admin", icon: "home" },
      { label: "Admissions", href: "/admin/admissions", icon: "admissions" },
      { label: "Students", href: "/admin/students", icon: "students" },
      { label: "Staff & HR", href: "/admin/staff", icon: "staff" },
      { label: "Fees", href: "/admin/fees", icon: "fees" },
      { label: "Attendance", href: "/admin/attendance", icon: "attendance" },
      { label: "Exams", href: "/admin/exams", icon: "exams" },
      { label: "Timetable", href: "/admin/timetable", icon: "timetable" },
      { label: "Library", href: "/admin/library", icon: "library" },
      { label: "Transport", href: "/admin/transport", icon: "bus" },
      { label: "Parents", href: "/admin/parents", icon: "parents" },
      { label: "Reports", href: "/admin/reports", icon: "reports" },
    ],
  },

  principal: {
    id: "principal", name: "Principal", role: "Head of School",
    tagline: "The whole school at a glance — approve, oversee, decide.",
    accent: "#7c3aed",
    user: { name: "Dr. S. Malik", sub: "Principal", initials: "SM" },
    nav: [
      { label: "Overview", href: "/principal", icon: "home" },
      { label: "Academics", href: "/principal/academics", icon: "exams" },
      { label: "Finance", href: "/principal/finance", icon: "wallet" },
      { label: "Staff", href: "/principal/staff", icon: "staff" },
      { label: "Approvals", href: "/principal/approvals", icon: "approve" },
    ],
  },

  teacher: {
    id: "teacher", name: "Teacher", role: "Class Teacher · 6-B",
    tagline: "Attendance, marks and homework — less paperwork, more teaching.",
    accent: "#2563eb",
    user: { name: "Sadia Karim", sub: "Class Teacher · 6-B", initials: "PS" },
    nav: [
      { label: "Dashboard", href: "/teacher", icon: "home" },
      { label: "Attendance", href: "/teacher/attendance", icon: "attendance" },
      { label: "Gradebook", href: "/teacher/gradebook", icon: "book" },
      { label: "Quizzes", href: "/teacher/quizzes", icon: "quiz" },
      { label: "Homework", href: "/teacher/homework", icon: "clipboard" },
      { label: "Certificates", href: "/teacher/certificates", icon: "award" },
      { label: "Messages", href: "/teacher/messages", icon: "msg" },
      { label: "Timetable", href: "/teacher/timetable", icon: "timetable" },
    ],
  },

  parent: {
    id: "parent", name: "Parent", role: "Parent of Ayaan · 6-B",
    tagline: "Everything about your child — in one friendly app.",
    accent: "#0d9488",
    user: { name: "Sana Khan", sub: "Parent · Ayaan (6-B)", initials: "SK" },
    nav: [
      { label: "Overview", href: "/parent", icon: "home" },
      { label: "Fees", href: "/parent/fees", icon: "wallet" },
      { label: "Fee voucher", href: "/parent/voucher", icon: "file" },
      { label: "Results", href: "/parent/results", icon: "exams" },
      { label: "Homework", href: "/parent/homework", icon: "clipboard" },
      { label: "Certificates", href: "/parent/certificates", icon: "award" },
      { label: "Messages", href: "/parent/messages", icon: "msg" },
      { label: "Events", href: "/parent/events", icon: "calendar" },
      { label: "Transport", href: "/parent/transport", icon: "bus" },
      { label: "Notices", href: "/parent/notices", icon: "megaphone" },
    ],
  },

  finance: {
    id: "finance", name: "Finance", role: "Accounts Office",
    tagline: "Collections, dues, expenses and payroll — money in real time.",
    accent: "#16a34a",
    user: { name: "Farah Naeem", sub: "Accountant", initials: "AF" },
    nav: [
      { label: "Dashboard", href: "/finance", icon: "home" },
      { label: "Collections", href: "/finance/collections", icon: "fees" },
      { label: "Vouchers", href: "/finance/vouchers", icon: "file" },
      { label: "Defaulters", href: "/finance/defaulters", icon: "bell" },
      { label: "Expenses", href: "/finance/expenses", icon: "receipt" },
      { label: "Payroll", href: "/finance/payroll", icon: "wallet" },
    ],
  },

  driver: {
    id: "driver", name: "Driver", role: "Route 1 · North Loop",
    tagline: "Your route, your manifest, your trip — one tap check-ins.",
    accent: "#d97706",
    user: { name: "Rashid Mehmood", sub: "Driver · Route 1", initials: "SK" },
    nav: [
      { label: "My Route", href: "/driver", icon: "route" },
      { label: "Live map", href: "/driver/live", icon: "pin" },
      { label: "Manifest", href: "/driver/manifest", icon: "clipboard" },
      { label: "Alerts", href: "/driver/alerts", icon: "megaphone" },
      { label: "Vehicle", href: "/driver/vehicle", icon: "fuel" },
    ],
  },

  student: {
    id: "student", name: "Student", role: "Student · Grade 6-B",
    tagline: "Your classes, homework, quizzes and results — all in one place.",
    accent: "#e11d48",
    user: { name: "Ayaan Khan", sub: "Grade 6-B · Roll 12", initials: "AK" },
    nav: [
      { label: "Overview", href: "/student", icon: "home" },
      { label: "Timetable", href: "/student/timetable", icon: "timetable" },
      { label: "Homework", href: "/student/homework", icon: "clipboard" },
      { label: "Quizzes", href: "/student/quizzes", icon: "quiz" },
      { label: "Results", href: "/student/results", icon: "star" },
      { label: "Certificates", href: "/student/certificates", icon: "award" },
      { label: "Attendance", href: "/student/attendance", icon: "attendance" },
    ],
  },

  staff: {
    id: "staff", name: "Staff", role: "Staff self-service",
    tagline: "Your profile, leave, payslips and school notices.",
    accent: "#0891b2",
    user: { name: "Tariq Javed", sub: "Admin Staff", initials: "MV" },
    nav: [
      { label: "Dashboard", href: "/staff", icon: "home" },
      { label: "Leave", href: "/staff/leave", icon: "clock" },
      { label: "Payslips", href: "/staff/payslips", icon: "receipt" },
      { label: "Directory", href: "/staff/directory", icon: "users" },
      { label: "Notices", href: "/staff/notices", icon: "megaphone" },
    ],
  },
};

export const PORTAL_LIST = ["admin", "principal", "teacher", "parent", "student", "finance", "driver", "staff"].map((id) => PORTALS[id]);
