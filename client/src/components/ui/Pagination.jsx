import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = memo(({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;
  if (!totalPages || totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <span className="text-sm text-secondary">
        Showing {start}–{end} of {total} tasks
      </span>
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages[0] > 1 && (
          <>
            <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
            {pages[0] > 2 && <span className="text-muted" style={{ padding: '0 4px' }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-muted" style={{ padding: '0 4px' }}>…</span>
            )}
            <button className="page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
          </>
        )}

        <button
          className="page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';
export default Pagination;
