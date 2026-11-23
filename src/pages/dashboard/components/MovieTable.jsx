export default function MovieTable({
  movies = [],
  loading,
  error,
  onRetry,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
  onOpenComments
}) {
  return (
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
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
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
            onClick={onOpenAdd}
            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
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
                <tr key={m._id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.title}</td>
                  <td className="py-3.5 px-4 text-slate-700">{m.director}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{m.year}</td>
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
                      onClick={() => onOpenComments(m)}
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
                        onClick={() => onOpenEdit(m)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-all cursor-pointer"
                        title="Edit Movie"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onOpenDelete(m)}
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
  );
}
