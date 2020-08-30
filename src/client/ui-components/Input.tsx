import * as React from "react";
import { tokens, utils } from "../styles";

const inputStyle: (state?: { hasChanged?: boolean }) => React.CSSProperties = (
  state = {}
) => ({
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  height: tokens.sizes("inputHeight"),
  outline: "none",
  ...utils.paddingX(3),
  ...utils.paddingY(2),
  borderRadius: tokens.radii(1),
  backgroundColor: state.hasChanged
    ? tokens.colors.inputValidation("infoBackground")
    : tokens.colors.input("background"),
  color: state.hasChanged
    ? tokens.colors.inputValidation("errorForeground")
    : tokens.colors.input("foreground"),
  border: state.hasChanged
    ? tokens.colors.inputValidation("infoBorder")
    : tokens.colors.input("border"),
});

export const Input: React.FC<{
  autoFocus?: boolean;
  hasChanged?: boolean;
  value: string;
  onChange: (newValue: string) => void;
}> = ({ autoFocus, value, onChange, hasChanged }) => {
  return (
    <input
      autoFocus={autoFocus}
      type="text"
      style={inputStyle({ hasChanged })}
      value={value}
      onChange={(event) => onChange(event?.target.value)}
    />
  );
};

export const NumberInput: React.FC<{
  hasChanged?: boolean;
  autoFocus?: boolean;
  value: number;
  onChange: (newValue: number) => void;
}> = ({ autoFocus, value, onChange, hasChanged }) => {
  return (
    <input
      autoFocus={autoFocus}
      type="number"
      style={inputStyle({ hasChanged })}
      value={value}
      onChange={(event) => onChange(Number(event?.target.value))}
    />
  );
};

export const Checkbox: React.FC<{
  autoFocus?: boolean;
  value: boolean;
  onChange: (newValue: boolean) => void;
}> = ({ autoFocus, value, onChange }) => {
  return (
    <input
      autoFocus={autoFocus}
      type="checkbox"
      style={{
        boxSizing: "border-box",
        outline: "none",
        ...utils.marginX(3),
        ...utils.marginY(2),
        backgroundColor: tokens.colors.checkbox("background"),
        color: tokens.colors.checkbox("foreground"),
        border: tokens.colors.checkbox("border"),
      }}
      checked={value}
      onChange={(event) => onChange(event?.target.checked)}
    />
  );
};
