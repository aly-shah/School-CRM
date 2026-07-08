import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { q } from "@/lib/db";
import { students, staff, classesSeed, homework } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CREDS = { "12": "ayaan2025" };
const QUIZ = {
  id: 1, title: "Fractions — Quick Quiz", subject: "Mathematics", by: "Sadia Karim",
  questions: [
    { q: "What is 1/2 + 1/4 ?", options: ["1/6", "3/4", "2/6", "1/2"], answer: 1 },
    { q: "Which is larger: 2/3 or 3/5 ?", options: ["2/3", "3/5", "They are equal", "Cannot tell"], answer: 0 },
    { q: "Simplify 4/8 to its lowest form", options: ["1/2", "2/4", "1/4", "4/8"], answer: 0 },
  ],
};
const MSGS = [
  { from: "teacher", text: "Hello! Ayaan is doing very well in Maths this term. 👏", at: "Mon 9:10" },
  { from: "parent", text: "Thank you Miss Sadia! Any areas he should focus on?", at: "Mon 9:24" },
  { from: "teacher", text: "A little more reading practice would help. Keep it up!", at: "Mon 9:31" },
];

async function count(table) {
  const r = await q(`SELECT count(*)::int AS n FROM ${table}`);
  return r.rows[0].n;
}

export async function POST(req) {
  // In production set SEED_SECRET; requests must send a matching x-seed-secret header.
  if (process.env.SEED_SECRET && req.headers.get("x-seed-secret") !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  try {
    // 1. schema
    const sql = readFileSync(join(process.cwd(), "db/schema.sql"), "utf8");
    await q(sql);

    // 2. students (idempotent by id)
    for (const s of students) {
      await q(
        `INSERT INTO students (id,name,grade,roll,gender,dob,blood,house,status,attendance,overall,grade_letter,rank,
           fee_annual,fee_paid,fee_due,address,medical,sibling,father_name,father_occ,father_phone,
           parent_name,parent_rel,parent_phone,parent_email,subjects)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.name, s.grade, s.roll, s.gender, s.dob || null, s.blood || null, s.house || null, s.status || "Active",
         s.attendance ?? 100, s.overall ?? 0, s.grade_letter || "—", String(s.rank ?? "—"),
         s.fees?.annual ?? 180000, s.fees?.paid ?? 0, s.fees?.due ?? s.feeDue ?? 0,
         s.address || null, s.medical || null, s.sibling || null,
         s.father?.name || null, s.father?.occ || null, s.father?.phone || null,
         s.parent?.name || null, s.parent?.rel || null, s.parent?.phone || null, s.parent?.email || null,
         JSON.stringify(s.subjects || [])]
      );
    }

    // 3. staff (only if empty)
    if ((await count("staff")) === 0) {
      for (const m of staff) {
        await q(`INSERT INTO staff (name,role,dept,phone,status) VALUES ($1,$2,$3,$4,$5)`,
          [m.name, m.role, m.dept, m.phone, m.status || "On duty"]);
      }
    }

    // 4. classes (idempotent by id)
    for (const c of classesSeed) {
      await q(`INSERT INTO classes (id,name,teacher,room,students,grid) VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.teacher, c.room, c.students, JSON.stringify(c.grid)]);
    }

    // 5. parent creds
    for (const [roll, pw] of Object.entries(CREDS)) {
      await q(`INSERT INTO parent_creds (roll,password) VALUES ($1,$2) ON CONFLICT (roll) DO NOTHING`, [roll, pw]);
    }

    // 6. quiz
    await q(`INSERT INTO quizzes (id,title,subject,"by",questions) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
      [QUIZ.id, QUIZ.title, QUIZ.subject, QUIZ.by, JSON.stringify(QUIZ.questions)]);

    // 7. messages (only if empty)
    if ((await count("messages")) === 0) {
      for (const m of MSGS) {
        await q(`INSERT INTO messages (thread,from_role,body,at) VALUES ($1,$2,$3,$4)`, ["12", m.from, m.text, m.at]);
      }
    }

    // 8. homework (only if empty) — seed items get stable ids
    if ((await count("homework")) === 0) {
      for (let i = 0; i < homework.length; i++) {
        const h = homework[i];
        await q(`INSERT INTO homework (id,title,subject,cls,due,descr,status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [`seed-${i}`, h.title, h.subject, h.cls, h.due, h.desc || null, h.status || "Open"]);
      }
    }

    // 9. library books
    if ((await count("library_books")) === 0) {
      const books = [
        ["Charlotte's Web", "E. B. White", "Fiction", 4, 3],
        ["Oxford Junior Dictionary", "Oxford Press", "Reference", 10, 8],
        ["The Jungle Book", "Rudyard Kipling", "Fiction", 3, 1],
        ["Science Encyclopedia", "DK Publishing", "Science", 2, 2],
        ["Pakistan Studies", "M. Ikram Rabbani", "Academics", 6, 5],
        ["Matilda", "Roald Dahl", "Fiction", 5, 5],
      ];
      for (const [t, a, c, tot, av] of books)
        await q("INSERT INTO library_books (title,author,category,total,available) VALUES ($1,$2,$3,$4,$5)", [t, a, c, tot, av]);
    }

    // 10. inventory
    if ((await count("inventory_items")) === 0) {
      const items = [
        ["Whiteboard markers", "Stationery", 120, "pcs", 50],
        ["A4 paper reams", "Stationery", 40, "reams", 20],
        ["Classroom chairs", "Furniture", 15, "pcs", 30],
        ["Science lab kits", "Lab", 8, "sets", 10],
        ["Footballs", "Sports", 12, "pcs", 6],
        ["First-aid boxes", "Health", 9, "boxes", 5],
      ];
      for (const [n, c, qn, u, m] of items)
        await q("INSERT INTO inventory_items (name,category,quantity,unit,min_stock) VALUES ($1,$2,$3,$4,$5)", [n, c, qn, u, m]);
    }

    // 11. drivers
    if ((await count("drivers")) === 0) {
      await q(`INSERT INTO drivers (name,cnic,phone,license_no,route,bus,status) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        ["Rashid Mehmood", "35201-1234567-1", "+92 300 8433445", "LHR-DL-99213", "Route 1 · North Loop", "LEB-4471", "Active"]);
    }

    const summary = {};
    for (const t of ["students", "staff", "classes", "quizzes", "messages", "homework", "library_books", "inventory_items", "drivers"]) {
      summary[t] = await count(t);
    }
    return NextResponse.json({ ok: true, seeded: summary });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
