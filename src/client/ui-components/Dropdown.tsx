import * as React from "react";
import { tokens } from "../styles";

export const Option: React.FC<{ value: string }> = ({ value, children }) => (
  <option
    value={value}
    style={{
      backgroundColor: tokens.colors.dropdown("listBackground"),
      color: tokens.colors.dropdown("foreground"),
    }}
  >
    {children}
  </option>
);

export const Dropdown: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
}> = ({ value, onChange, children }) => {
  return (
    <select
      style={{
        backgroundColor: tokens.colors.dropdown("background"),
        border: tokens.colors.dropdown("border"),
      }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
};
