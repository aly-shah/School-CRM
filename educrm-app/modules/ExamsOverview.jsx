import { PageHeader, Card, Pill, gradeClass, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { exams, students } from "@/lib/data";

export default function ExamsOverview() {
  const sample = students[0];
  const total = sample.subjects.reduce((a, b) => a + b.mark, 0);

  return (
    <>
      <PageHeader title="Exams & Report Cards" subtitle="Create exams, enter marks and publish branded report cards in one click">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>New exam</button>
      </PageHeader>

      <div className="grid g-2">
        <Card title="Examinations" pad={false}>
          <Table
            minWidth={480}
            rows={exams}
            cols={[
              { label: "Exam", render: (e) => <span style={{ fontWeight: 600 }}>{e.name}</span> },
              { label: "Classes", render: (e) => <span className="soft">{e.cls}</span> },
              { label: "Status", render: (e) => <Pill kind={e.status.includes("published") ? "good" : "warn"}>{e.status}</Pill> },
              { label: "Period", align: "r", render: (e) => <span className="soft">{e.date}</span> },
            ]}
          />
        </Card>

        <Card title="Sample report card — auto-generated" link="Customise">
          <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: "var(--accent)", color: "#fff", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><b style={{ fontSize: 14 }}>Springdale International</b><div style={{ fontSize: 11.5, opacity: 0.85 }}>Term 2 Report · 2025–26</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11.5, opacity: 0.85 }}>Student</div><b style={{ fontSize: 13 }}>{sample.name} · {sample.grade}</b></div>
            </div>
            <div className="tbl-wrap">
              <table className="tbl compact" style={{ minWidth: 0 }}>
                <thead><tr><th>Subject</th><th className="r">Marks</th><th className="r">Grade</th></tr></thead>
                <tbody>
                  {sample.subjects.map((s) => (
                    <tr key={s.name}><td>{s.name}</td><td className="r tnum">{s.mark}</td><td className="r"><span className={`pill ${gradeClass(s.grade)}`}>{s.grade}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderTop: "1px solid var(--line)", fontSize: 12.5 }}>
              <span className="muted">Total <b className="tnum" style={{ color: "var(--ink)" }}>{total}/500</b> · {sample.overall}%</span>
              <span className="muted">Rank <b style={{ color: "var(--ink)" }}>{sample.rank}/32</b> · Grade <b style={{ color: "var(--good)" }}>{sample.grade_letter}</b></span>
            </div>
          </div>
          <div className="soft" style={{ fontSize: 12, marginTop: 12 }}>Fully customisable to your school's format, logo and grading system.</div>
        </Card>
      </div>
    </>
  );
}
