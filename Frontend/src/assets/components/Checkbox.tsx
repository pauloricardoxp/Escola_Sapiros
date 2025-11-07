import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center text-blue-900 text-base font-normal cursor-pointer">
      <input
        type="checkbox"
        className="mr-2 h-5 w-5 text-blue-500 border-blue-500 rounded focus:ring-blue-500 bg-blue-50"
        {...props}
      />
      {label}
    </label>
  );
}
