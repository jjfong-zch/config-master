import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button = ({
  variant = "primary",
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
      ${
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          : "text-gray-700 hover:bg-gray-100"
      } ${props.className || ""}`}
  >
    {children}
  </button>
);
