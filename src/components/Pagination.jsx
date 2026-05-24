import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 md:mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl 
                   text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none
                   transition-all"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`e${i}`} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-xs text-slate-400 font-bold">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-xl text-xs md:text-sm font-bold transition-all ${
              page === currentPage
                ? 'bg-navy-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl 
                   text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none
                   transition-all"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
};

export default Pagination;
