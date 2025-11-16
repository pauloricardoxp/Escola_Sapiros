import Select from "react-select";
import { Controller } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  control: any;
  options: { value: string; label: string }[];
  placeholder?: string;
  isDisabled?: boolean;
}

export default function ReactSelect({
  name,
  control,
  options,
  placeholder = "",
  isDisabled = false,
}: SelectFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);
        return (
          <Select
            {...field}
            options={options}
            value={selectedOption || null}
            placeholder={placeholder}
            isDisabled={isDisabled}
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
  );
}
