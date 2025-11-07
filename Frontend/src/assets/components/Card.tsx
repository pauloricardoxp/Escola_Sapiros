import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10 
                  max-w-5xl w-full flex flex-col lg:flex-row overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
