import type { ReactNode } from "react";

export function FormRowMatricula({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row gap-8 w-full">
      {children}
    </div>
  );
}