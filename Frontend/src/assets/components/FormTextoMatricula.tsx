import type { ReactNode } from "react";

type FormFieldProps = {
  title: ReactNode | string;
  children?: ReactNode;
  className?: string;
};

function FormTextoMatricula({ title, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-black/80 text-base">{title}</span>
      {children}
    </div>
  );
}

export default FormTextoMatricula;