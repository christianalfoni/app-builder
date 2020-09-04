import * as React from "react";
import { tokens, useHoverStyle, utils } from "../styles";

export const Button: React.FC<{ onClick: () => void }> = ({
  onClick,
  children,
}) => {
  const [ref, hoverStyle] = useHoverStyle<HTMLDivElement>({
    backgroundColor: tokens.colors.button("hoverBackground"),
  });

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
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
    </div>
  );
};
