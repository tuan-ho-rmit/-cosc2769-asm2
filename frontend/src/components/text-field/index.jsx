import React from 'react';
import PropTypes from 'prop-types';

export const TextField = ({
    label,
    placeholder = 'Enter text',
    type = 'text',
    value,
    onChange,
    size = 'md',
    disabled = false,
    error,
    style,
    ...props
}) => {
    const baseStyles = 'w-full border-1 rounded transition text-black outline-none';

    const sizeStyles = {
        sm: 'py-1 px-2 text-sm',
        md: 'py-2 px-4 text-md',
        lg: 'py-3 px-6 text-lg',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
    const borderStyles = error ? 'border-danger' : 'border-grey-300';
    const focusRingStyles = error ? 'ring-danger' : 'ring-primary';

    return (
        <div style={{width:"100%"}}>
            {label && <label className="block text-white mb-2">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${borderStyles} focus:ring-1 ${focusRingStyles}`}
                disabled={disabled}
                style={style}
                {...props}
            />
            {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
    );
};

TextField.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
    value: PropTypes.string,
    onChange: PropTypes.func,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    error: PropTypes.string,
    style: PropTypes.object,
};

export default TextField;
