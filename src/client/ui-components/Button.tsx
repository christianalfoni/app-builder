import * as React from "react";
import { tokens, useHoverStyle, utils } from "../styles";

export const Button: React.FC<{ onClick: () => void; disabled?: boolean }> = ({
  onClick,
  children,
  disabled,
}) => {
  const [ref, hoverStyle] = useHoverStyle<HTMLButtonElement>({
    backgroundColor: tokens.colors.button("hoverBackground"),
  });

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      style={{
        border: 0,
        backgroundColor: tokens.colors.button("background"),
        color: tokens.colors.button("foreground"),
        borderRadius: tokens.radii(1),
        cursor: "pointer",
        ...utils.marginX(2),
        ...utils.paddingX(3),
        ...utils.paddingY(1),
        ...hoverStyle,
      }}
    >
      {children}
    </button>
  );
};
