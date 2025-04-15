const Card = ({ title, genre, isLocked }) => {
  return (
    <div
      className={`rounded-xl shadow p-4 flex flex-col justify-between ${
        isLocked ? "bg-gray-100" : "bg-white border border-emerald-100"
      }`}
    >
      <div>
        <h2
          className={`text-lg font-semibold mb-1 ${
            isLocked ? "text-gray-500" : "text-gray-800"
          }`}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500">{genre}</p>
      </div>
      {isLocked ? (
        <div className="mt-4 flex items-center justify-between">
          <button
            className="mt-auto bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed text-sm"
            disabled
          >
            Bloqueado
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c.552 0 1 .448 1 1v1a1 1 0 11-2 0v-1c0-.552.448-1 1-1zm6 0V8a6 6 0 10-12 0v3m12 0a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2m12 0H6"
            />
          </svg>
        </div>
      ) : (
        <button className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition text-sm">
          Ouvir
        </button>
      )}
    </div>
  );
};

export default Card;
