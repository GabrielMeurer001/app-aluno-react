import React from 'react';

const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  labelLink, // Object containing { text: 'Esqueceu?', to: '/esqueceu' }
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id}>
          {label}
          {labelLink && (
            <a href={labelLink.to} onClick={(e) => {
              if (labelLink.onClick) {
                e.preventDefault();
                labelLink.onClick();
              }
            }}>
              {labelLink.text}
            </a>
          )}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        {...props}
      />
      {error && (
        <span className="error-message">
          ⚠️ {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
