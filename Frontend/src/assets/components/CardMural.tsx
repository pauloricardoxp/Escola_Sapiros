import React from "react";

interface CardMuralProps {
  type: "full" | "mini";
  className?: string;
}

const CardMural: React.FC<CardMuralProps> = ({ type, className }) => {
  const isFull = type === "full";

  return (
    <div
      className={`
        w-full ${isFull ? "h-full" : "h-[400px]"}
        p-8 rounded-xl
        bg-white shadow-md
        ${className || ""}
      `}
    >
      {isFull && (
        <>
          <h2 className="text-4xl font-light text-[#3d7e8f] mb-4 text-center">
            Mural de avisos
          </h2>

          <div className="w-full h-[calc(100% - 60px)] overflow-y-auto space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="w-full h-10 bg-[#eaf3fa] border border-[#8cb3cd] rounded-lg"
              >
              </div>
            ))}
          </div>
        </>
      )}

      {!isFull && (
        <div className="w-full h-full flex items-center justify-center"></div>
      )}
    </div>
  );
};

export default CardMural;
