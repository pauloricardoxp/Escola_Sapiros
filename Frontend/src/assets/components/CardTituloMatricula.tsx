import type { ReactNode } from "react";

function CardTituloMatricula({ children }: {children: ReactNode}) {
  return (
    <div className="w-full h-14 bg-[#3d7e8f] rounded-lg flex justify-center items-center px-4">
      <span className="w-full h-10  text-white text-4xl font-normal ">
        {children}
      </span>
    </div>
  );
}
export default CardTituloMatricula;