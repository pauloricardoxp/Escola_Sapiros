import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-blue-900 mb-1">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          className={`w-full p-3 ${
            icon ? "pl-10" : "pl-3"
          } border border-gray-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base placeholder-gray-500`}
          {...props}
        />
      </div>

      {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
    </div>
  );
}
