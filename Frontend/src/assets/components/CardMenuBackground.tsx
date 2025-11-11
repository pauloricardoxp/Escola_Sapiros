import React from "react";

interface CardMenuProps {
  children?: React.ReactNode;
}

const CardMenuBackground: React.FC<CardMenuProps> = ({ children }) => {
  return (
    <div className="w-full h-full grid grid-cols-3 gap-4">
      {children}
    </div>
  );
};

export default CardMenuBackground;
