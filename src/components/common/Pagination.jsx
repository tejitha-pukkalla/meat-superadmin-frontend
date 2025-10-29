// src/components/common/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Display some page numbers (simplified for brevity) */}
        {pages.map(page => (
            // A simplified way to only show current and neighbors, plus ellipsis
            (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) ? (
                <button
                    key={page}
                    onClick={() => handleClick(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ) : null
        ))}

        <button
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;