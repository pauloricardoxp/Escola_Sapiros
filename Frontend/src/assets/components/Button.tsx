import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`
        w-full h-12 sm:h-14 
        text-white text-lg sm:text-xl font-normal rounded-lg 
        transition duration-200 focus:outline-none focus:ring-4
        
       
        ${
          !disabled
            ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
            : "bg-gray-400 cursor-not-allowed opacity-70"
        }
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
