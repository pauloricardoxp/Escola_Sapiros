import React from "react";

interface CardMuralProps {
  type: "full" | "mini";
}

const CardMural: React.FC<CardMuralProps> = ({ type }) => {
  const isFull = type === "full";
  return (
    <div
      className={`
            w-full ${isFull ? "h-full" : "h-[400px]"} p-8  bg-white rounded-xl`}
    >
      {isFull && (
        <>
          <h2 className="text-4xl font-light text-[#3d7e8f] mb-4 text-center">
            Mural
          </h2>

          <div className="w-full h-[calc(100%-60px)] border-gray-200 rounded-xl p-4 mt-8">
            <p className="text-gray-400">
            </p>
          </div>
        </>
      )}

      {!isFull && (
        <div className="w-full h-full flex items-center justify-center">
        </div>
      )}
    </div>
  );
};

export default CardMural;
