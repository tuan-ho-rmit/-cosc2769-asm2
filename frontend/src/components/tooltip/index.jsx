import PropTypes from 'prop-types';
import { useState } from 'react';

const Tooltip = ({ text, children, position = 'top' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'top-1/2 right-full transform -translate-y-1/2 mr-2',
        right: 'top-1/2 left-full transform -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block"
            >
                {children}
            </div>
            {showTooltip && (
                <span
                    className={`absolute text-xs bg-grey-200 text-black p-2 rounded whitespace-nowrap ${positionClasses[position]}`}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

export default Tooltip;
