import React from "react";

interface CardMenuProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void
}

const CardMenu: React.FC<CardMenuProps> = ({ title, icon, onClick }) => {
  return (
    <div className="w-full h-[150px]p-5  bg-white rounded-xl flex flex-col justify-between cursor-pointer" onClick={onClick}>
      <div className="w-full flex justify-center items-center h-2/3">
        <div className="w-fit h-fit">{icon}</div>
      </div>

      <div className="w-full flex justify-center items-center h-1/3">
        <p className="text-lg font-semibold text-gray-700 leading-snug text-center">
          {title}
        </p>
      </div>
    </div>
  );
};

export default CardMenu;
