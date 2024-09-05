import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css'

class Ripple {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  findFurthestPoint(clickPointX, elementWidth, offsetX, clickPointY, elementHeight, offsetY) {
    this.x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth;
    this.y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight;
    this.z = Math.hypot(this.x - (clickPointX - offsetX), this.y - (clickPointY - offsetY));
    return this.z;
  }

  appyStyles(element, color, rect, radius, event) {
    element.classList.add('ripple');
    element.style.backgroundColor = color === 'dark' ? 'rgba(0,0,0, 0.2)' : 'rgba(255,255,255, 0.3)';
    element.style.borderRadius = '50%';
    element.style.pointerEvents = 'none';
    element.style.position = 'absolute';
    element.style.left = event.clientX - rect.left - radius + 'px';
    element.style.top = event.clientY - rect.top - radius + 'px';
    element.style.width = element.style.height = radius * 2 + 'px';
  }

  applyAnimation(element) {
    element.animate(
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1.5)', opacity: 0 },
      ],
      { duration: 500, easing: 'linear' }
    );
  }

  create(event, color) {
    const element = event.currentTarget;
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const rect = element.getBoundingClientRect();
    const radius = this.findFurthestPoint(
      event.clientX,
      element.offsetWidth,
      rect.left,
      event.clientY,
      element.offsetHeight,
      rect.top
    );

    const circle = document.createElement('span');
    this.appyStyles(circle, color, rect, radius, event);
    this.applyAnimation(circle);

    element.appendChild(circle);

    setTimeout(() => circle.remove(), 500);
  }
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  style,
  ripple = true,
  ...props
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (ripple) {
      const button = buttonRef.current;
      const rippleInstance = new Ripple();
      button.addEventListener('mouseup', (event) => rippleInstance.create(event, 'light'));

      return () => {
        button.removeEventListener('mouseup', (event) => rippleInstance.create(event, 'light'));
      };
    }
  }, [ripple]);

  const baseStyles = 'flex items-center justify-center rounded-full relative overflow-hidden font-normal transition';

  const variantStyles = {
    primary: 'bg-primary text-black hover:bg-darkPrimary',
    success: 'bg-success text-white hover:bg-darkSuccess',
    danger: 'bg-danger text-white hover:bg-darkDanger',
    'outline-primary': 'border-2 border-primary text-primary',
    'outline-danger': 'border-2 border-danger text-danger hover:bg-red-100',
  };

  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-md',
    lg: 'py-3 px-6 text-lg',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const activeStyles = disabled
    ? ''
    : 'active:opacity-[0.85]';

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`ripple-button ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${activeStyles}`}
      onClick={disabled ? null : onClick}
      disabled={disabled}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'outline-primary', 'outline-danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  ripple: PropTypes.bool,
};

