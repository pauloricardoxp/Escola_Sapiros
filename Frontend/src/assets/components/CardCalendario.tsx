import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/react-calendario.css";
import type { Value } from "react-calendar/dist/shared/types.js";

interface CardCalendarioProps {
  type?: "full" | "mini";
}

const CardCalendario: React.FC<CardCalendarioProps> = () => {
  const [value, setValue] = useState<Value>(new Date());

  return (
    <div>
      <div className="w-full border-gray-200 rounded-xl p-4 mt-4 flex justify-center">
        <div className="scale-110 origin-top">
          <Calendar
            className="custom-calendar"
            onChange={(v: Value) => setValue(v)}
            value={value}
            locale="pt-BR"
          />
        </div>
      </div>
    </div>
  );
};

export default CardCalendario;
