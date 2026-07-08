"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatTile, Card, Pill, Table } from "@/components/ui";
import { I } from "@/components/icons";
import { getBooks, addBook, getLoans, issueBook, returnBook, getInventory, addInventory, adjustInventory, getStudents } from "@/lib/store";

const inp = { padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", background: "var(--panel)", color: "var(--ink)", minWidth: 0 };

export default function LibraryInventory() {
  const [tab, setTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [inv, setInv] = useState([]);
  const [students, setStudents] = useState([]);
  const [issue, setIssue] = useState({ studentId: "", bookId: "", due: "" });
  const [nb, setNb] = useState({ title: "", author: "", category: "", total: "" });
  const [ni, setNi] = useState({ name: "", category: "", quantity: "", unit: "pcs", minStock: "" });
  const [showNb, setShowNb] = useState(false);
  const [showNi, setShowNi] = useState(false);

  const load = async () => {
    setBooks(await getBooks()); setLoans(await getLoans()); setInv(await getInventory());
  };
  useEffect(() => { load(); getStudents().then(setStudents); }, []);

  const doIssue = async () => {
    const st = students.find((s) => s.id === issue.studentId);
    if (!st || !issue.bookId) return;
    try {
      await issueBook({ bookId: Number(issue.bookId), student: st.name, roll: st.roll, issued: new Date().toLocaleDateString("en-GB"), due: issue.due || "in 14 days" });
    } catch (e) { alert(String(e.message || e)); return; }
    setIssue({ studentId: "", bookId: "", due: "" });
    load();
  };
  const doReturn = async (id) => { await returnBook(id); load(); };
  const createBook = async () => { if (!nb.title.trim()) return; await addBook(nb); setNb({ title: "", author: "", category: "", total: "" }); setShowNb(false); load(); };
  const createItem = async () => { if (!ni.name.trim()) return; await addInventory(ni); setNi({ name: "", category: "", quantity: "", unit: "pcs", minStock: "" }); setShowNi(false); load(); };
  const adjust = async (id, d) => { await adjustInventory(id, d); load(); };

  const lowStock = inv.filter((x) => x.quantity < x.min_stock).length;
  const totalBooks = books.reduce((a, b) => a + b.total, 0);
  const issued = books.reduce((a, b) => a + (b.total - b.available), 0);

  return (
    <>
      <PageHeader title="Library & Inventory" subtitle="Catalogue, issue/return and school stock" />

      <div className="tiles" style={{ marginBottom: 20 }}>
        <StatTile label="Book titles" icon={I.library} tint={{ bg: "var(--accent-weak)", fg: "var(--accent)" }} value={books.length} sub={`${totalBooks} copies`} />
        <StatTile label="Issued" icon={I.book} tint={{ bg: "var(--info-bg)", fg: "var(--info)" }} value={issued} sub="on loan" />
        <StatTile label="Inventory items" icon={I.box} tint={{ bg: "var(--good-bg)", fg: "var(--good)" }} value={inv.length} sub="tracked" />
        <StatTile label="Low stock" icon={I.bell} tint={{ bg: "var(--warn-bg)", fg: "var(--warn)" }} value={lowStock} sub="need reorder" />
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {[["books", "Books"], ["loans", "Issued"], ["inventory", "Inventory"]].map(([k, l]) => (
          <a key={k} href="#" onClick={(e) => { e.preventDefault(); setTab(k); }} className={tab === k ? "active" : ""}>{l}</a>
        ))}
      </div>

      {tab === "books" && (
        <>
          <Card title="Issue a book" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <select value={issue.studentId} onChange={(e) => setIssue({ ...issue, studentId: e.target.value })} style={{ ...inp, flex: "1 1 180px" }}>
                <option value="">Select student…</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.grade}</option>)}
              </select>
              <select value={issue.bookId} onChange={(e) => setIssue({ ...issue, bookId: e.target.value })} style={{ ...inp, flex: "1 1 180px" }}>
                <option value="">Select book…</option>
                {books.filter((b) => b.available > 0).map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
              <input value={issue.due} onChange={(e) => setIssue({ ...issue, due: e.target.value })} placeholder="Due (e.g. 21 Jul)" style={{ ...inp, flex: "0 1 150px" }} />
              <button className="btn primary" onClick={doIssue}>{I.check}Issue</button>
            </div>
          </Card>

          <Card title="Catalogue" link={showNb ? "Close" : "Add book"} pad={false}>
            {showNb && (
              <div className="card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap", borderBottom: "1px solid var(--line-soft)" }}>
                <input value={nb.title} onChange={(e) => setNb({ ...nb, title: e.target.value })} placeholder="Title" style={{ ...inp, flex: "2 1 160px" }} />
                <input value={nb.author} onChange={(e) => setNb({ ...nb, author: e.target.value })} placeholder="Author" style={{ ...inp, flex: "1 1 140px" }} />
                <input value={nb.category} onChange={(e) => setNb({ ...nb, category: e.target.value })} placeholder="Category" style={{ ...inp, flex: "1 1 120px" }} />
                <input value={nb.total} onChange={(e) => setNb({ ...nb, total: e.target.value })} placeholder="Copies" type="number" style={{ ...inp, flex: "0 1 90px" }} />
                <button className="btn primary" onClick={createBook}>Add</button>
              </div>
            )}
            <Table minWidth={560} rows={books}
              cols={[
                { label: "Title", render: (b) => <span style={{ fontWeight: 600 }}>{b.title}</span> },
                { label: "Author", render: (b) => <span className="soft">{b.author}</span> },
                { label: "Category", render: (b) => <Pill kind="mute">{b.category}</Pill> },
                { label: "Available", align: "r", render: (b) => <span className="tnum" style={{ color: b.available ? "var(--good)" : "var(--bad)" }}>{b.available} / {b.total}</span> },
              ]} />
          </Card>
        </>
      )}

      {tab === "loans" && (
        <Card title="Issued books" pad={false}>
          <Table minWidth={560} rows={loans} empty="No books currently issued."
            cols={[
              { label: "Book", render: (l) => <span style={{ fontWeight: 600 }}>{l.book_title}</span> },
              { label: "Student", render: (l) => <span className="soft">{l.student} · Roll {l.roll}</span> },
              { label: "Issued", render: (l) => <span className="soft">{l.issued}</span> },
              { label: "Due", align: "r", render: (l) => <Pill kind="warn">{l.due}</Pill> },
              { label: "", align: "r", render: (l) => <button className="btn" style={{ padding: "6px 12px" }} onClick={() => doReturn(l.id)}>Return</button> },
            ]} />
        </Card>
      )}

      {tab === "inventory" && (
        <Card title="School inventory" link={showNi ? "Close" : "Add item"} pad={false}>
          {showNi && (
            <div className="card-pad" style={{ display: "flex", gap: 10, flexWrap: "wrap", borderBottom: "1px solid var(--line-soft)" }}>
              <input value={ni.name} onChange={(e) => setNi({ ...ni, name: e.target.value })} placeholder="Item" style={{ ...inp, flex: "2 1 160px" }} />
              <input value={ni.category} onChange={(e) => setNi({ ...ni, category: e.target.value })} placeholder="Category" style={{ ...inp, flex: "1 1 120px" }} />
              <input value={ni.quantity} onChange={(e) => setNi({ ...ni, quantity: e.target.value })} placeholder="Qty" type="number" style={{ ...inp, flex: "0 1 80px" }} />
              <input value={ni.unit} onChange={(e) => setNi({ ...ni, unit: e.target.value })} placeholder="Unit" style={{ ...inp, flex: "0 1 80px" }} />
              <input value={ni.minStock} onChange={(e) => setNi({ ...ni, minStock: e.target.value })} placeholder="Min" type="number" style={{ ...inp, flex: "0 1 80px" }} />
              <button className="btn primary" onClick={createItem}>Add</button>
            </div>
          )}
          <Table minWidth={560} rows={inv}
            cols={[
              { label: "Item", render: (x) => <span style={{ fontWeight: 600 }}>{x.name}</span> },
              { label: "Category", render: (x) => <Pill kind="mute">{x.category}</Pill> },
              { label: "In stock", align: "r", render: (x) => <span className="tnum" style={{ fontWeight: 700 }}>{x.quantity} {x.unit}</span> },
              { label: "Status", align: "r", render: (x) => x.quantity < x.min_stock ? <Pill kind="bad" dot>Low</Pill> : <Pill kind="good" dot>OK</Pill> },
              { label: "Adjust", align: "r", render: (x) => (
                <span style={{ display: "inline-flex", gap: 6 }}>
                  <button className="btn" style={{ padding: "5px 10px" }} onClick={() => adjust(x.id, -1)}>−</button>
                  <button className="btn" style={{ padding: "5px 10px" }} onClick={() => adjust(x.id, 1)}>+</button>
                </span>
              ) },
            ]} />
        </Card>
      )}
    </>
  );
}
