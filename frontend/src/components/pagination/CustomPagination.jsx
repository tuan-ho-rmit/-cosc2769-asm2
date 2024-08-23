import PropTypes from "prop-types";

function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

const CustomPagination = ({ totalPages, currentPage, onChange }) => {

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= Math.floor(maxPagesToShow / 2)) {
            endPage = maxPagesToShow;
        } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (startPage > 1) {
            pageNumbers.unshift("...");
        }
        if (endPage < totalPages) {
            pageNumbers.push("...");
        }

        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (page === "..." || page === currentPage) {
            return;
        }
        scrollToTop();
        onChange(page);
    };

    return (
        <div className="flex justify-center mt-5 space-x-2">
            <button
                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : `border-gray-300 text-primary`} ${currentPage === 1 ? '' : 'hover:bg-gray-100'}`}
                onClick={() => currentPage === 1 ? null : handlePageChange(1)}
                disabled={currentPage === 1}
            >
                {"<<"}
            </button>
            <button
                className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : `border-gray-300 text-primary`} ${currentPage === 1 ? '' : 'hover:bg-gray-100'}`}
                onClick={() => currentPage === 1 ? null : handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {"<"}
            </button>
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    className={`px-3 py-1 rounded border ${page === "..." ? 'text-gray-500 cursor-default' : `border-gray-300 ${currentPage === page ? `bg-primary text-white` : `text-primary`} hover:bg-gray-100`}`}
                    onClick={() => handlePageChange(page)}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}
            <button
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : `border-gray-300 text-primary`} ${currentPage === totalPages ? '' : 'hover:bg-gray-100'}`}
                onClick={() => currentPage === totalPages ? null : handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {">"}
            </button>
            <button
                className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : `border-gray-300 text-primary`} ${currentPage === totalPages ? '' : 'hover:bg-gray-100'}`}
                onClick={() => currentPage === totalPages ? null : handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                {">>"}
            </button>
        </div>
    );
};

CustomPagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CustomPagination;
