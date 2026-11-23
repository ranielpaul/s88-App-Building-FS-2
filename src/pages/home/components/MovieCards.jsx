import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";

const genreColors = {
  Action: "bg-blue-50 text-blue-700 border-blue-200",
  Comedy: "bg-amber-50 text-amber-700 border-amber-200",
  Drama: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SciFi: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Sci-Fi": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Horror: "bg-rose-50 text-rose-700 border-rose-200",
  Romance: "bg-pink-50 text-pink-700 border-pink-200",
  Thriller: "bg-purple-50 text-purple-700 border-purple-200",
  Animation: "bg-teal-50 text-teal-700 border-teal-200"
};

export function MovieCard({ movie, onViewMovie }) {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  const badgeStyle =
    genreColors[movie.genre] || "bg-blue-50 text-blue-700 border-blue-200";

  const handleView = () => {
    if (onViewMovie) {
      onViewMovie(movie);
    } else {
      navigate(`/movie/${movie._id}`);
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle} tracking-wide uppercase`}
          >
            {movie.genre || "General"}
          </span>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {movie.year || "N/A"}
          </span>
        </div>
        
        <img
          src="/placeholder.png"
          alt="Movie placeholder"
          className="w-full h-48 object-cover"
        />

        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {movie.title}
        </h3>

        <p className="text-xs text-blue-600 font-medium mt-1 mb-3 flex items-center gap-1.5">
          <span className="text-slate-400">Director:</span>
          <span>{movie.director || "Unknown"}</span>
        </p>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {movie.description || "No description available for this movie."}
        </p>
      </div>

      {/* Card Footer / View Movie Button */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <span>💬</span>
          <span>{movie.comments?.length || 0} comments</span>
        </div>

        {isAuthenticated() ? (
          <button
            onClick={handleView}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 group-hover:scale-[1.02]"
          >
            <span>View Movie</span>
            <span>→</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="px-3 py-1.5 rounded-xl text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
          >
            Sign in to view
          </button>
        )}
      </div>
    </div>
  );
}

export default function MovieCards({ movies = [], onViewMovie }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-3xl shadow-xs">
        <div className="text-4xl mb-3">🎞️</div>
        <h3 className="text-base font-semibold text-slate-800">No Movies Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          There are currently no movies available in this catalog or matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onViewMovie={onViewMovie} />
      ))}
    </div>
  );
}
