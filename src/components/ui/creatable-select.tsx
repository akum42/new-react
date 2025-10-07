import { useEffect, useMemo, useState } from "react";
import CreatableSelectLib from "react-select/creatable";
import type { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface CreatableSelectProps {
  value?: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  onCreateOption?: (value: string) => void;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export function CreatableSelect({
  value,
  options,
  onChange,
  onCreateOption,
  placeholder,
  isClearable = false,
  isDisabled = false,
  className,
}: CreatableSelectProps) {
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMenuPortalTarget(document.body);
  }, []);

  const normalizedOptions = useMemo(() => {
    const entries = options
      .map((option) => option?.trim())
      .filter((option): option is string => !!option)
      .map((option) => [option, { value: option, label: option } as Option]);

    return Array.from(new Map(entries).values());
  }, [options]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    const match = normalizedOptions.find((option) => option.value === value);
    return match ?? { value, label: value };
  }, [value, normalizedOptions]);

  const styles = useMemo<StylesConfig<Option, false>>(
    () => ({
      control: (provided, state) => ({
        ...provided,
        backgroundColor: "hsl(var(--background))",
        borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
        boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--ring))" : "none",
        minHeight: "2.5rem",
        borderRadius: "var(--radius)",
        ":hover": {
          borderColor: "hsl(var(--ring))",
        },
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "hsl(var(--popover))",
        color: "hsl(var(--popover-foreground))",
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }),
      menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "hsl(var(--accent))" : "transparent",
        color: state.isFocused ? "hsl(var(--accent-foreground))" : "hsl(var(--popover-foreground))",
        cursor: "pointer",
      }),
      singleValue: (provided) => ({
        ...provided,
        color: "hsl(var(--foreground))",
      }),
      placeholder: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
      }),
      input: (provided) => ({
        ...provided,
        color: "hsl(var(--foreground))",
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: "0.25rem 0.5rem",
      }),
      indicatorsContainer: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
      }),
      dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
        ":hover": {
          color: "hsl(var(--foreground))",
        },
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: "hsl(var(--muted-foreground))",
        ":hover": {
          color: "hsl(var(--foreground))",
        },
      }),
    }),
    []
  );

  return (
    <CreatableSelectLib<Option, false>
      className={className}
      classNamePrefix="creatable-select"
      value={selectedOption}
      options={normalizedOptions}
      styles={styles}
      isClearable={isClearable}
      isDisabled={isDisabled}
      placeholder={placeholder}
      onChange={(option) => onChange(option?.value ?? null)}
      onCreateOption={(inputValue) => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        onCreateOption?.(trimmed);
        onChange(trimmed);
      }}
      formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
      noOptionsMessage={() => "Type to add options"}
      menuPortalTarget={menuPortalTarget ?? undefined}
      menuPosition={menuPortalTarget ? "fixed" : "absolute"}
    />
  );
}
