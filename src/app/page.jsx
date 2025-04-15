"use client";

import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Gemini } from "@/lib/gemini";
import Card from "@/components/card";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [musics, setMusics] = useState([
    { title: "Blinding Lights", genre: "Pop", isLocked: false },
    { title: "Bohemian Rhapsody", genre: "Rock Clássico", isLocked: true },
    { title: "Shape of You", genre: "Pop", isLocked: true },
    { title: "Lo-Fi Dreams", genre: "Lo-Fi", isLocked: true },
    { title: "Believer", genre: "Alternativo", isLocked: true },
    { title: "Imagine", genre: "Piano", isLocked: true },
  ]);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const prompt = `Baseado no sentimento "${message}", recomende 6 músicas no formato JSON array.
      Cada música deve ter: title (string), genre (string) e isLocked (boolean - 1 destravada e 5 travadas).
      Exemplo: [{"title":"Happy","genre":"Pop","isLocked":false},{"title":"Sad Song","genre":"Blues","isLocked":true}]`;

      const result = await Gemini.models.generateContentStream({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      let responseText = "";

      // Itera sobre os chunks de resposta
      for await (const chunk of result) {
        responseText += chunk.text;
      }

      // Agora, você pode continuar com a lógica de análise da resposta
      const startIndex = responseText.indexOf("[");
      const endIndex = responseText.lastIndexOf("]") + 1;
      const jsonString = responseText.slice(startIndex, endIndex);

      const recommendedMusics = JSON.parse(jsonString);
      setMusics(recommendedMusics);
    } catch (error) {
      console.error("Erro ao gerar recomendações:", error);
      // Mantém as músicas padrão em caso de erro
    } finally {
      setIsLoading(false);
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p>Gerando recomendações musicais...</p>
          </div>
        ) : (
          <div className="max-w-6xl w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {musics.map((music, index) => (
              <Card
                key={index}
                title={music.title}
                genre={music.genre}
                isLocked={music.isLocked}
              />
            ))}
          </div>
        )}
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
              disabled={isLoading}
            ></textarea>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className={`absolute bottom-2.5 right-2 ${
                message.trim() && !isLoading
                  ? "text-emerald-600 hover:text-emerald-700"
                  : "text-gray-400"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14L21 3m0 0v7m0-7h-7M3 10l9 11"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
