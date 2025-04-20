"use client";

import { useState } from "react";

const Card = ({ title, artist, genre, links }) => {
  const [showDialog, setShowDialog] = useState(false);

  const openService = (service) => {
    if (links && links[service]) {
      window.open(links[service], "_blank");
    }
    setShowDialog(false);
  };

  return (
    <div className="rounded-xl shadow p-4 flex flex-col justify-between bg-white border border-emerald-100">
      <div>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mb-1">{artist}</p>
        <p className="text-xs text-gray-500">{genre}</p>
      </div>

      <button
        onClick={() => setShowDialog(true)}
        className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition text-sm"
        disabled={!links}
      >
        Ouvir
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Ouvir {title} em:</h3>

            <div className="space-y-3">
              <button
                onClick={() => openService("spotify")}
                disabled={!links?.spotify}
                className={`w-full flex items-center justify-center px-4 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-lg transition ${
                  !links?.spotify ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </button>

              <button
                onClick={() => openService("youtube")}
                disabled={!links?.youtube}
                className={`w-full flex items-center justify-center px-4 py-3 bg-[#FF0000] hover:bg-[#ff3333] text-white rounded-lg transition ${
                  !links?.youtube ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                YouTube Music
              </button>
            </div>

            <button
              onClick={() => setShowDialog(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
