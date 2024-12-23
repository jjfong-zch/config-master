import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);
