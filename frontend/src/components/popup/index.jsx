import PropTypes from 'prop-types';
import Button from '../button';

export default function PopUp({
    open,
    onClose,
    onConfirm,
    customActions,
    hideConfirm,
    hideClose,
    title,
    subTitle,
    desc,
    hideTitle
}) {
    return (
        <div>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'} ${open ? 'pointer-events-auto' : 'pointer-events-none'} duration-300 ease-in-out`}
                style={{ transition: 'opacity 200ms ease-in-out' }}
            />
            
            {/* Modal */}
            <div
                className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'} ${open ? 'pointer-events-auto' : 'pointer-events-none'} duration-300 ease-in-out`}
                style={{ transition: 'opacity 200ms ease-in-out' }}
            >
                <div className="bg-black rounded-lg shadow-lg w-full max-w-lg">
                    {!hideTitle && (
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xl font-semibold text-center flex-1">{title}</h5>
                                {subTitle && <p className="text-green-500 text-sm">{subTitle}</p>}
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Close"
                                    onClick={onClose}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="p-4">
                        {desc}
                    </div>
                    {!(hideClose && hideConfirm) && (
                        <div className="px-4 py-3 border-t border-gray-200 flex justify-between">
                            {!hideClose && (
                                <Button variant='danger' onClick={onClose}>Cancel</Button>
                            )}
                            {!hideConfirm && (
                                <Button variant='success' onClick={onConfirm}>Confirm</Button>
                            )}
                        </div>
                    )}
                    {customActions && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            {customActions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

PopUp.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    customActions: PropTypes.node,
    hideConfirm: PropTypes.bool,
    hideClose: PropTypes.bool,
    title: PropTypes.node,
    subTitle: PropTypes.node,
    desc: PropTypes.node.isRequired,
    hideTitle: PropTypes.bool
};
