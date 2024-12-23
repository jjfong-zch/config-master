import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "hidden";
}

export const Badge = ({ children, variant = "default" }: BadgeProps) => (
  <span
    className={`text-xs px-2 py-1 rounded
    ${
      variant === "hidden"
        ? "text-gray-500 bg-gray-100"
        : "text-gray-500 bg-gray-50"
    }`}
  >
    {children}
  </span>
);
