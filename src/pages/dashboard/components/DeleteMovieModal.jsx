export default function DeleteMovieModal({ isOpen, movie, onClose, onConfirm, submitting }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center text-slate-900">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-2xl mx-auto mb-3">
          🗑️
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Movie</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-slate-900 font-semibold">&quot;{movie.title}&quot;</span>? This action
          cannot be undone.
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
