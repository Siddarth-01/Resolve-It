import React from "react";

const Card = ({
  children,
  className = "",
  title,
  subtitle,
  headerClassName = "",
  bodyClassName = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div
          className={`bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 ${headerClassName}`}
        >
          {title && (
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
          )}
          {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={`p-8 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
