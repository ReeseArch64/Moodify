"use client";

import { useState, useRef } from "react";
import Card from "@/components/card";

export default function Home() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Mensagem enviada:", message);
      // Aqui você pode adicionar a lógica para enviar a mensagem
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-white overflow-y-auto">
        <div className="max-w-6xl w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Blinding Lights" genre="Pop" isLocked={false} />
          <Card
            title="Bohemian Rhapsody"
            genre="Rock Clássico"
            isLocked={true}
          />
          <Card title="Shape of You" genre="Pop" isLocked={true} />
          <Card title="Lo-Fi Dreams" genre="Lo-Fi" isLocked={true} />
          <Card title="Believer" genre="Alternativo" isLocked={true} />
          <Card title="Imagine" genre="Piano" isLocked={true} />
        </div>
      </div>

      {/* Input box */}
      <form
        className="sticky bottom-0 w-full bg-gradient-to-t from-white via-white/70 to-transparent px-4 py-4"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto w-full max-w-2xl flex items-end gap-2 relative">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              id="messageInput"
              rows="1"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                autoResize(e.target);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Como você está se sentindo hoje?"
              className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-0"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
