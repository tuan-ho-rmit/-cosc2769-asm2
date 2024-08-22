import PropTypes from 'prop-types';
import CircularProgress from '../CircularProgress';
import CustomPagination from './CustomPagination';

function BasePaginationList({
    list = [],
    loading,
    renderItem,
    totalPages,
    page,
    onChangePage,
    titleTotal,
    totalItems,
    renderEmpty
}) {
    return (
        <div className="overflow-y-auto">
            <div className="container mx-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : !list.length ? (
                    <div className="flex justify-center items-center h-full">
                        {renderEmpty ? renderEmpty() : <></>}
                    </div>
                ) : (
                    <div>
                        {titleTotal && (
                            <div className="mb-4 text-right">
                                <span className="text-primary">{titleTotal}: {totalItems || 0}</span>
                            </div>
                        )}
                        <div>
                            {list.map((item, index) => (
                                <div className="w-full" key={index}>
                                    {renderItem ? renderItem(item) : <></>}
                                </div>
                            ))}
                        </div>
                        {totalPages && totalPages > 1 && (
                            <div className="mt-6">
                                <CustomPagination
                                    totalPages={totalPages}
                                    currentPage={page}
                                    onChange={onChangePage}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

BasePaginationList.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    renderItem: PropTypes.func,
    totalPages: PropTypes.number,
    page: PropTypes.number,
    onChangePage: PropTypes.func,
    titleTotal: PropTypes.string,
    totalItems: PropTypes.number,
    renderEmpty: PropTypes.func
};

export default BasePaginationList;
