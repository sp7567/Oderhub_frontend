/**
 * components/Pagination.jsx — Page navigation controls.
 */

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show a window of pages around the current one
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, page + 2);
    const visible = pages.slice(start - 1, end);
    if (start > 1)         visible.unshift("...", 1);
    if (end < totalPages)  visible.push("...", totalPages);
    return visible;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn btn-secondary btn-sm disabled:opacity-40"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {getVisiblePages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-500">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn btn-sm min-w-[36px] ${
              p === page
                ? "bg-brand-600 text-white border-brand-600"
                : "btn-secondary"
            }`}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn btn-secondary btn-sm disabled:opacity-40"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
