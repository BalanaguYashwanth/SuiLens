import React, { useState } from 'react';
import './InfoTooltip.scss';

interface InfoTooltipProps {
  message: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  message, 
  size = 'medium', 
  position = 'bottom',
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
    }

    setTooltipPosition({ top, left });
    setShowTooltip(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
    }

    setTooltipPosition({ top, left });
    setShowTooltip(true);
  };

  const getTransform = () => {
    switch (position) {
      case 'top':
        return 'translateX(-50%)';
      case 'bottom':
        return 'translateX(-50%)';
      case 'left':
        return 'translateY(-50%)';
      case 'right':
        return 'translateY(-50%)';
      default:
        return 'translateX(-50%)';
    }
  };

  return (
    <div 
      className={`info-tooltip-icon ${size} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
      {showTooltip && (
        <div 
          className="custom-tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: getTransform()
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip; 