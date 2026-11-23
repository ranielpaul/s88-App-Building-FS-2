import { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../api";
import notyf from "../../utils/notyf";

import MovieTable from "./components/MovieTable";
import AddMovieModal from "./components/AddMovieModal";
import EditMovieModal from "./components/EditMovieModal";
import DeleteMovieModal from "./components/DeleteMovieModal";
import CommentsModal from "./components/CommentsModal";

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(UserContext);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // Active selections
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieComments, setMovieComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all movies for the catalog table
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
  const handleAddMovie = async (formData) => {
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
  const handleOpenEdit = (movie) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };

  // Handle Update Movie
  const handleUpdateMovie = async (formData) => {
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
  const handleOpenDelete = (movie) => {
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
  const handleOpenComments = async (movie) => {
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Movie</span>
          </button>
        </div>

        {/* Movies Table Component */}
        <MovieTable
          movies={movies}
          loading={loading}
          error={error}
          onRetry={() => {
            setLoading(true);
            fetchMovies();
          }}
          onOpenAdd={() => setShowAddModal(true)}
          onOpenEdit={handleOpenEdit}
          onOpenDelete={handleOpenDelete}
          onOpenComments={handleOpenComments}
        />
      </main>

      {/* Modals */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddMovie}
        submitting={submitting}
      />

      <EditMovieModal
        key={selectedMovie?._id || "none"}
        isOpen={showEditModal}
        movie={selectedMovie}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMovie(null);
        }}
        onSubmit={handleUpdateMovie}
        submitting={submitting}
      />

      <DeleteMovieModal
        isOpen={showDeleteModal}
        movie={selectedMovie}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMovie(null);
        }}
        onConfirm={handleDeleteMovie}
        submitting={submitting}
      />

      <CommentsModal
        isOpen={showCommentsModal}
        movie={selectedMovie}
        comments={movieComments}
        onClose={() => {
          setShowCommentsModal(false);
          setSelectedMovie(null);
        }}
      />
    </div>
  );
}
