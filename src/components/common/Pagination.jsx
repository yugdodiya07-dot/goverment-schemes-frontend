import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxDisplayed = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayed / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplayed - 1);

  if (endPage - startPage + 1 < maxDisplayed) {
    startPage = Math.max(1, endPage - maxDisplayed + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Page navigation" className="mt-4">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link shadow-none"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i> Prev
          </button>
        </li>

        {startPage > 1 && (
          <>
            <li className="page-item">
              <button className="page-link shadow-none" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? 'active' : ''}`}
          >
            <button
              className="page-link shadow-none"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button className="page-link shadow-none" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link shadow-none"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
