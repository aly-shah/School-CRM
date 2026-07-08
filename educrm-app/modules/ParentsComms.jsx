import { PageHeader, StatTile, Card, Avatar, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { students, notices } from "@/lib/data";

export default function ParentsComms() {
  const withParents = students.filter((s) => s.parent);
  return (
    <>
      <PageHeader title="Parents & Communication" subtitle="Keep every family in the loop — SMS, WhatsApp & the parent app">
        <button className="btn primary"><span style={{ display: "flex" }}>{I.msg}</span>New broadcast</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Parents on app" icon={I.parents} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value="92%" sub="1,181 active" />
        <StatTile label="Messages sent" icon={I.msg} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value="3,402" sub="this month" />
        <StatTile label="Avg. read rate" icon={I.check} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value="87%" sub="within 1 hour" />
        <StatTile label="Unanswered" icon={I.bell} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value="6" sub="teacher replies pending" />
      </div>

      <div className="grid g-2">
        <Card title="Recent broadcasts" link="History">
          <div className="list">
            {notices.map((b, i) => (
              <div key={i} className="list-row">
                <span style={{ width: 8, height: 8, borderRadius: "50%", flex: "0 0 auto", background: `var(--${b.kind === "mute" ? "muted" : b.kind})` }} />
                <div className="l-main"><div className="l-t">{b.title}</div><div className="l-s">{b.tag}</div></div>
                <span className="muted" style={{ fontSize: 12 }}>{b.when}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Parent contacts" pad={false}>
          <Table
            rows={withParents}
            footer="+ 1,278 more parents on the platform"
            cols={[
              { label: "Parent", render: (s) => <div className="who"><Avatar name={s.parent.name} size={30} /><span className="nm">{s.parent.name}</span></div> },
              { label: "Student", render: (s) => <span className="soft">{s.name} · {s.grade}</span> },
              { label: "Phone", align: "r", render: (s) => <span className="soft tnum">{s.parent.phone}</span> },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
