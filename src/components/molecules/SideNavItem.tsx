import React from "react";

interface SideNavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  indent?: boolean;
}

export const SideNavItem = ({
  label,
  isActive,
  onClick,
  indent = true,
}: SideNavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium
      ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
      }
      ${indent ? "ml-2" : ""}
      transition-all duration-200`}
  >
    {label}
  </button>
);
