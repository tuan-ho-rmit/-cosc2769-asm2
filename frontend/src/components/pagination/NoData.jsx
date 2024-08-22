import PropTypes from 'prop-types';

const NoData = ({ children }) => {

    return (
        <div className={`flex flex-col justify-center items-center bg-gray-800 min-h-[450px] p-4`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12" // 48px = 12 * 4px
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
                />
            </svg>
            {children}
        </div>
    );
};

NoData.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NoData;
