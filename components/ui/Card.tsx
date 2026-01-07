// Reusable Card component

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  onClick
}: CardProps) {
  const baseStyles = 'bg-gray-900 rounded-lg border border-gray-700 shadow-sm';
  const hoverStyles = hover ? 'hover:shadow-md hover:border-blue-500 transition-all cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
