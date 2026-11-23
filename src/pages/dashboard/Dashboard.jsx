import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../api";
import notyf from "../../utils/notyf";

const INITIAL_FORM = {
  title: "",
  director: "",
  year: new Date().getFullYear(),
  genre: "Action",
  description: ""
};

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(UserContext);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieComments, setMovieComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all movies for the table
  const fetchMovies = useCallback(() => {
    return api
      .get("/movies/getMovies")
      .then((res) => {
        const list = res.data?.movies || (Array.isArray(res.data) ? res.data : []);
        setMovies(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load movies. Please check your connection.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Handle Add Movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.director || !formData.genre) {
      notyf.error("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        director: formData.director.trim(),
        year: Number(formData.year),
        description: formData.description.trim(),
        genre: formData.genre
      };

      await api.post("/movies/addMovie", payload);
      notyf.success("Movie added successfully!");
      setShowAddModal(false);
      setFormData(INITIAL_FORM);
      fetchMovies();
    } catch (err) {
      console.error("Add movie error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add movie.";
      notyf.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title || "",
      director: movie.director || "",
      year: movie.year || new Date().getFullYear(),
      genre: movie.genre || "Action",
      description: movie.description || ""
    });
    setShowEditModal(true);
  };

  // Handle Update Movie
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    try {
      setSubmitting(true);
      const payload = {
        title: formData.title.trim(),
        director: formData.director.trim(),
        year: Number(formData.year),
        description: formData.description.trim(),
        genre: formData.genre
      };

      await api.patch(`/movies/updateMovie/${selectedMovie._id}`, payload);
      notyf.success("Movie updated successfully!");
      setShowEditModal(false);
      setSelectedMovie(null);
      setFormData(INITIAL_FORM);
      fetchMovies();
    } catch (err) {
      console.error("Update movie error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update movie.";
      notyf.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (movie) => {
    setSelectedMovie(movie);
    setShowDeleteModal(true);
  };

  // Handle Delete Movie
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    try {
      setSubmitting(true);
      await api.delete(`/movies/deleteMovie/${selectedMovie._id}`);
      notyf.success("Movie deleted successfully!");
      setShowDeleteModal(false);
      setSelectedMovie(null);
      fetchMovies();
    } catch (err) {
      console.error("Delete movie error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete movie.";
      notyf.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Comments Modal
  const openCommentsModal = async (movie) => {
    setSelectedMovie(movie);
    setShowCommentsModal(true);
    setMovieComments(movie.comments || []);

    try {
      const res = await api.get(`/movies/getComments/${movie._id}`);
      if (res.data?.comments) {
        setMovieComments(res.data.comments);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  // If not logged in or not admin, show guard screen
  if (!isAuthenticated() || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center text-3xl mx-auto mb-4">
              🔒
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This dashboard is restricted to administrator accounts. Please sign in with an
              authorized admin account to manage movies.
            </p>
            <div className="space-y-3">
              <Link
                to="/auth"
                className="block w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all"
              >
                Sign In as Admin
              </Link>
              <Link
                to="/"
                className="block w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              >
                Back to Home Catalog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                Admin Panel
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {movies.length} Total Movies
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Movie Management Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              View all catalog entries in table format, add new titles, update existing details, or remove movies.
            </p>
          </div>

          {/* Add Movie Button */}
          <button
            onClick={() => {
              setFormData(INITIAL_FORM);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Movie</span>
          </button>
        </div>

        {/* Movies Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-slate-500">Loading catalog data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4">
              <p className="text-rose-600 text-xs mb-3">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchMovies();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl"
              >
                Retry
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="text-3xl mb-2">🎞️</div>
              <h3 className="text-sm font-semibold text-slate-800">No Movies in Catalog</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Click &quot;Add Movie&quot; above to create your first movie entry.
              </p>
              <button
                onClick={() => {
                  setFormData(INITIAL_FORM);
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700"
              >
                + Add Movie
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Director</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Genre</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Description</th>
                    <th className="py-3.5 px-4 text-center">Comments</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movies.map((m) => (
                    <tr
                      key={m._id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {m.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {m.director}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {m.year}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {m.genre || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate hidden md:table-cell">
                        {m.description || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => openCommentsModal(m)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                        >
                          <span>💬</span>
                          <span className="font-mono text-[11px] font-bold text-blue-700">
                            {m.comments?.length || 0}
                          </span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(m)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-all cursor-pointer"
                            title="Edit Movie"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(m)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-all cursor-pointer"
                            title="Delete Movie"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Add New Movie</h3>
            <p className="text-xs text-slate-500 mb-6">
              Provide movie details to add to the public catalog.
            </p>

            <form onSubmit={handleAddMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Director *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christopher Nolan"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="1888"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Genre *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Short synopsis of the film..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Adding..." : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Movie Modal */}
      {showEditModal && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-slate-900">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Update Movie</h3>
            <p className="text-xs text-slate-500 mb-6">
              Editing: <span className="text-blue-600 font-semibold">{selectedMovie.title}</span>
            </p>

            <form onSubmit={handleUpdateMovie} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Director *</label>
                  <input
                    type="text"
                    required
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="1888"
                    max="2100"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Genre *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-2xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Movie</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-slate-900 font-semibold">&quot;{selectedMovie.title}&quot;</span>? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteMovie}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Comments Viewer Modal */}
      {showCommentsModal && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-xs text-slate-900">
            <button
              onClick={() => setShowCommentsModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Comments for &quot;{selectedMovie.title}&quot;</h3>
            <p className="text-slate-500 mb-4">
              Total {movieComments.length} {movieComments.length === 1 ? "comment" : "comments"}
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {movieComments.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
                  No comments yet for this movie.
                </div>
              ) : (
                movieComments.map((c, idx) => (
                  <div
                    key={c._id || idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-blue-600">
                        {c.userId ? `User (${c.userId.slice(-6)})` : "Movie Fan"}
                      </span>
                    </div>
                    <p className="text-slate-700">{c.comment || c.text || JSON.stringify(c)}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCommentsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
