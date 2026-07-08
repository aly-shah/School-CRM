import { PageHeader, StatTile, Avatar, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { admissions, admissionStages } from "@/lib/data";

const stageTint = {
  Enquiry: "var(--muted)", Application: "var(--accent)", Visit: "var(--info)",
  Offer: "var(--warn)", Enrolled: "var(--good)",
};

export default function Admissions() {
  return (
    <>
      <PageHeader title="Admissions" subtitle="Track every prospective family from enquiry to enrolment">
        <button className="btn"><span style={{ display: "flex" }}>{I.filter}</span>Filter</button>
        <button className="btn primary"><span style={{ display: "flex" }}>{I.plus}</span>New enquiry</button>
      </PageHeader>

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Open enquiries" tint={{}} value="120" sub="this month" />
        <StatTile label="Applications" tint={{}} value="86" sub="in progress" />
        <StatTile label="Offers pending" tint={{}} value="48" sub="awaiting response" />
        <StatTile label="Enrolled" tint={{}} value="39" sub="+12 vs last month" />
      </div>

      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "minmax(230px, 1fr)", gap: 14, minWidth: 900 }}>
          {admissionStages.map((stage) => {
            const items = admissions.filter((a) => a.stage === stage);
            return (
              <div key={stage} className="card" style={{ background: "var(--panel-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 15px", borderBottom: "1px solid var(--line-soft)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: stageTint[stage] }} />
                  <b style={{ fontSize: 13 }}>{stage}</b>
                  <span className="pill mute" style={{ marginLeft: "auto" }}>{items.length}</span>
                </div>
                <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.length === 0 && <div className="muted" style={{ fontSize: 12.5, padding: "10px 6px" }}>No entries</div>}
                  {items.map((a) => (
                    <div key={a.name} className="card" style={{ padding: 12 }}>
                      <div className="who" style={{ marginBottom: 8 }}>
                        <Avatar name={a.name} size={30} />
                        <span><span className="nm" style={{ fontSize: 13 }}>{a.name}</span><br /><span className="sc">{a.grade}</span></span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Pill kind="mute">{a.source}</Pill>
                        <span className="muted tnum" style={{ fontSize: 12 }}>{a.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
