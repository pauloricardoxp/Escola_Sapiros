import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import { ListarPaises } from "../utils/ListarPaises";

interface NacionalidadeSelectProps {
  name?: string;
  placeholder?: string;
}

export default function NacionalidadeSelect({
  name = "nacionalidade",
  placeholder = "Selecione",
}: NacionalidadeSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption = ListarPaises().find(
            (opt) => opt.value === field.value
          );

          return (
            <Select
              {...field}
              options={ListarPaises()}
              value={selectedOption || null}
              placeholder={placeholder}
              onChange={(option) => field.onChange(option?.value)}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "3rem",
                  padding: "0 0.75rem",
                  backgroundColor: "#ebf8ff",
                  borderColor: "#d1d5db",
                  borderRadius: "0.5rem",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#3d7e8f" },
                }),
                singleValue: (base) => ({ ...base, color: "#374151" }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
          );
        }}
      />
      {errors?.[name] && (
        <span className="text-red-500 text-sm">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
