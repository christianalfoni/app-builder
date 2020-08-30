import * as React from "react";
import { tokens, utils, useHoverStyle } from "../styles";

export const Tabs: React.FC = ({ children }) => (
  <div
    style={{
      display: "flex",
    }}
  >
    {children}
  </div>
);

export const Tab: React.FC<{ active?: boolean; onClick: () => void }> = ({
  active,
  onClick,
  children,
}) => {
  const [ref, hoverStyle] = useHoverStyle<HTMLDivElement>({
    backgroundColor: active
      ? tokens.colors.button("hoverBackground")
      : tokens.colors.button("secondaryHoverBackground"),
  });

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        backgroundColor: active
          ? tokens.colors.button("background")
          : tokens.colors.button("secondaryBackground"),
        color: active
          ? tokens.colors.button("foreground")
          : tokens.colors.button("secondaryForeground"),
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
