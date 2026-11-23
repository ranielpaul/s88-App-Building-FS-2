import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import api from "../../../api";
import notyf from "../../../utils/notyf";

export default function MovieDetails({ movie: propMovie, onClose }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(UserContext);

  const [movie, setMovie] = useState(propMovie || null);
  const [comments, setComments] = useState(() => propMovie?.comments || []);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(!propMovie);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState("");

  const movieId = propMovie?._id || paramId;

  // Fetch movie details if not provided via props
  useEffect(() => {
    if (propMovie) {
      return;
    }
    if (!movieId) return;

    let ignore = false;
    api
      .get(`/movies/getMovie/${movieId}`)
      .then((res) => {
        if (!ignore) {
          const data = res.data?.movie || res.data;
          setMovie(data);
          if (data?.comments) {
            setComments(data.comments);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Error fetching movie:", err);
          setError("Failed to load movie details.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [propMovie, movieId]);

  // Fetch comments with auth token
  useEffect(() => {
    if (!movieId || !isAuthenticated()) return;
    let ignore = false;

    api
      .get(`/movies/getComments/${movieId}`)
      .then((res) => {
        if (!ignore && res.data?.comments) {
          setComments(res.data.comments);
        }
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });

    return () => {
      ignore = true;
    };
  }, [movieId, isAuthenticated]);

  // Handle adding comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (user?.isAdmin) {
      notyf.error("Admins cannot submit comments (Server restriction).");
      return;
    }

    try {
      setSubmittingComment(true);
      const res = await api.patch(`/movies/addComment/${movieId}`, {
        comment: commentText.trim()
      });

      notyf.success("Comment posted successfully!");
      setCommentText("");

      if (res.data?.updatedMovie?.comments) {
        setComments(res.data.updatedMovie.comments);
      } else {
        const fresh = await api.get(`/movies/getComments/${movieId}`);
        if (fresh.data?.comments) {
          setComments(fresh.data.comments);
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      try {
        const postRes = await api.post(`/movies/addComment/${movieId}`, {
          comment: commentText.trim()
        });
        notyf.success("Comment posted successfully!");
        setCommentText("");
        if (postRes.data?.updatedMovie?.comments) {
          setComments(postRes.data.updatedMovie.comments);
        }
      } catch (postErr) {
        const errMsg =
          postErr.response?.data?.message ||
          postErr.response?.data?.error ||
          "Failed to submit comment.";
        notyf.error(errMsg);
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
        <p className="text-rose-600 text-sm mb-4">{error || "Movie not found."}</p>
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  const content = (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full mx-auto shadow-xl relative text-slate-900">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition-colors cursor-pointer"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-2 mb-3 pr-8">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
          {movie.genre || "General"}
        </span>
        <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Year: {movie.year}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
        {movie.title}
      </h1>

      <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mb-6">
        <span className="text-slate-500">Directed by</span>
        <span className="text-slate-800 font-semibold">{movie.director}</span>
      </div>

      {/* Description */}
      <div className="mb-6 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Description
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {movie.description || "No description provided."}
        </p>
      </div>

      {/* Comments Section */}
      <div className="pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Comments</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-mono font-semibold border border-blue-200">
              {comments.length}
            </span>
          </h4>
        </div>

        {/* Comment list */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-5">
          {comments.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-400">No comments yet. Share your thoughts!</p>
            </div>
          ) : (
            comments.map((c, idx) => (
              <div
                key={c._id || idx}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    <span>👤</span>
                    <span>{c.userId ? `User (${c.userId.slice(-6)})` : "Movie Fan"}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-normal">
                  {c.comment || c.text || JSON.stringify(c)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input Form */}
        {isAuthenticated() ? (
          user?.isAdmin ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              ℹ️ Logged in as Admin. Commenting is reserved for regular moviegoers.
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment about this movie..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-blue-500/20"
              >
                {submittingComment ? "Posting..." : "Post"}
              </button>
            </form>
          )
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
            <span>Please </span>
            <button
              onClick={() => navigate("/auth")}
              className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700 cursor-pointer"
            >
              sign in
            </button>
            <span> to leave a comment.</span>
          </div>
        )}
      </div>
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col py-8 px-4">
      <div className="max-w-2xl mx-auto w-full mb-4">
        <button
          onClick={handleClose}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Catalog
        </button>
      </div>
      {content}
    </div>
  );
}
