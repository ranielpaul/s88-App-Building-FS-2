import { useState, useEffect, useMemo } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MovieCards from "./components/MovieCards";
import MovieDetails from "./components/MovieDetails";
import api from "../../api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeMovie, setActiveMovie] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    api
      .get("/movies/getMovies")
      .then((res) => {
        if (!ignore) {
          const list = res.data?.movies || (Array.isArray(res.data) ? res.data : []);
          setMovies(list);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to fetch movies:", err);
          setError("Unable to load movies right now. Please try again later.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // Extract unique genres for filter pills
  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (m.genre) set.add(m.genre);
    });
    return ["All", ...Array.from(set)];
  }, [movies]);

  // Filter movies based on search and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || movie.genre?.toLowerCase() === selectedGenre.toLowerCase();

      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, selectedGenre]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Clean White & Blue Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-blue-100/40 border border-blue-200/70 p-8 sm:p-12 mb-10 shadow-sm">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 mb-4">
              <span>🎬</span> Cinema & Movie Discovery
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Explore Top Movies & Reviews
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              Browse our curated collection of films, read descriptions, check director credits,
              and join discussions with fellow movie lovers.
            </p>

            {/* Clean Search Input */}
            <div className="relative max-w-lg">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by title, director, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <div className="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Movie Catalog</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any movie card to view detailed synopsis and audience comments
            </p>
          </div>

          {/* Genre Pills */}
          {genres.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 max-w">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-slate-500">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4 bg-rose-50 border border-rose-200 rounded-3xl">
            <p className="text-rose-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setReloadKey((k) => k + 1);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <MovieCards movies={filteredMovies} onViewMovie={(movie) => setActiveMovie(movie)} />
        )}

        {/* Movie Details Modal */}
        {activeMovie && (
          <MovieDetails movie={activeMovie} onClose={() => setActiveMovie(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
}
