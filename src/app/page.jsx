"use client";

import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Gemini } from "@/lib/gemini";
import Card from "@/components/card";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [musics, setMusics] = useState([]);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setMessage("");

    try {
      const prompt = `Baseado no sentimento "${message}", recomende 6 músicas no formato JSON array.
        Cada música deve ter: title (string), artist (string), genre (string).
        Inclua também links para Spotify e YouTube Music no formato:
        [{
          "title": "Happy",
          "artist": "Pharrell Williams",
          "genre": "Pop",
          "links": {
            "spotify": "https://open.spotify.com/track/...",
            "youtube": "https://music.youtube.com/watch?v=..."
          }
        }]`;

      const result = await Gemini.models.generateContentStream({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      let responseText = "";

      for await (const chunk of result) {
        responseText += chunk.text;
      }

      const startIndex = responseText.indexOf("[");
      const endIndex = responseText.lastIndexOf("]") + 1;
      const jsonString = responseText.slice(startIndex, endIndex);

      const recommendedMusics = JSON.parse(jsonString);
      setMusics(recommendedMusics);
    } catch (error) {
      console.error("Erro ao gerar recomendações:", error);
    } finally {
      setIsLoading(false);
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
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-white overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
            <p>Gerando recomendações musicais...</p>
          </div>
        ) : (
          <>
            {musics.length === 0 ? (
              <p className="text-xl text-gray-600">
                Diga algo para mim e eu vou te recomendar músicas.
              </p>
            ) : (
              <div className="max-w-6xl w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {musics.map((music, index) => (
                  <Card
                    key={index}
                    title={music.title}
                    genre={music.genre}
                    links={music.links}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
          </div>
        </div>
      </form>
    </div>
  );
}
