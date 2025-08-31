"use client";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I’m online. Type a message and I’ll echo it." },
  ]);
  const [input, setInput] = useState("");

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // optimistic UI
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("bad response");
      const data: { reply: string } = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Could not reach backend. Is it running on :8000?" },
      ]);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">AgriCopilot — Chat (Echo)</h1>

        <div className="border rounded-xl p-4 h-[60vh] overflow-y-auto bg-white">
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block px-3 py-2 rounded-2xl ${
                  m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="px-4 py-2 rounded-xl bg-black text-white" type="submit">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
