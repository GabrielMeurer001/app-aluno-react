import React from 'react';

const Card = ({
  badge,
  badgeType, // 'blue' or default
  title,
  description,
  progress, // number between 0 and 100
  progressText,
  buttonText,
  onButtonClick,
  icon,
  children,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card__body">
        {badge && (
          <span className={`card__badge ${badgeType === 'blue' ? 'badge-blue' : ''}`}>
            {badge}
          </span>
        )}
        
        {icon && <div className="card-indicator-icon">{icon}</div>}
        
        {title && <h3 className="card__title">{title}</h3>}
        
        {description && <p className="card__description">{description}</p>}
        
        {progress !== undefined && (
          <div className="card__progress-container">
            <div className="card__progress">
              <div style={{ width: `${progress}%` }}></div>
            </div>
            <span className="card__progress-text">
              {progressText || `${progress}%`}
            </span>
          </div>
        )}
        
        {children}
      </div>
      
      {buttonText && (
        <button onClick={onButtonClick} className="card__button">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;
