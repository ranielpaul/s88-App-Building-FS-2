export default function CommentsModal({ isOpen, movie, comments = [], onClose }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-xs text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-sm cursor-pointer"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Comments for &quot;{movie.title}&quot;
        </h3>
        <p className="text-slate-500 mb-4">
          Total {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </p>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
              No comments yet for this movie.
            </div>
          ) : (
            comments.map((c, idx) => (
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
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
