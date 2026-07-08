"use client";
import { useEffect, useRef, useState } from "react";
import { PageHeader, Avatar, Pill } from "@/components/ui";
import { I } from "@/components/icons";
import { getMessages, addMessage } from "@/lib/store";

const KEY = "12"; // demo thread: Ayaan (roll 12) — parent Sana ↔ teacher Sadia

export default function Chat({ sender, otherName, otherSub, title = "Messages" }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => { getMessages(KEY).then(setMsgs); }, []);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const m = { from: sender, text: t, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMsgs([...msgs, m]);
    setText("");
    await addMessage(KEY, m);
  };

  return (
    <>
      <PageHeader title={title} subtitle={sender === "parent" ? "Chat directly with your child's class teacher" : "Conversations with parents"} />
      <div className="card chat">
        <div className="chat-head">
          <Avatar name={otherName} size={38} />
          <div><div className="nm" style={{ fontWeight: 600 }}>{otherName}</div><div className="sc" style={{ color: "var(--muted)", fontSize: 12 }}>{otherSub}</div></div>
          <Pill kind="good" dot>Online</Pill>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.from === sender ? "me" : "them"}`}>
              {m.text}<span className="bt">{m.at}</span>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" aria-label="Message" />
          <button type="submit" className="btn primary" aria-label="Send">{I.send}</button>
        </form>
      </div>
    </>
  );
}
