import * as React from "react";

const createColorCssVariables = (
  category: string
): (<T extends string>(...names: T[]) => (color: T) => string) => {
  // Can use "names" to verify if correct color is passed in
  return (...names) => (color) => `var(--vscode-${category}-${color})`;
};

const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "1rem",
};

const radii = {
  0: "0",
  1: "3px",
};

const fontSizes = {
  small: "10px",
  normal: "14px",
  big: "16px",
};

const sizes = {
  inputHeight: "30px",
};

export const tokens = {
  colors: {
    button: createColorCssVariables("button")(
      "background",
      "foreground",
      "hoverBackground",
      "secondaryBackground",
      "secondaryForeground",
      "secondaryHoverBackground"
    ),
    input: createColorCssVariables("input")(
      "background",
      "border",
      "foreground",
      "placeholderForeground"
    ),
    list: createColorCssVariables("list")(
      "activeSelectionBackground",
      "activeSelectionForeground",
      "focusBackground",
      "focusForeground"
    ),
    dropdown: createColorCssVariables("dropdown")(
      "background",
      "listBackground",
      "border",
      "foreground"
    ),
    badge: createColorCssVariables("badge")("foreground", "background"),
    checkbox: createColorCssVariables("checkbox")(
      "foreground",
      "background",
      "border"
    ),
    inputValidation: createColorCssVariables("inputValidation")(
      "errorBackground",
      "errorForeground",
      "errorBorder",
      "infoBackground",
      "infoForeground",
      "infoBorder",
      "warningBackground"
    ),
    sideBar: createColorCssVariables("sideBar")(
      "background",
      "foreground",
      "border",
      "dropBackground"
    ),
  },
  spacing: (space: keyof typeof spacing) => spacing[space],
  radii: (rad: keyof typeof radii) => radii[rad],
  fontSizes: (size: keyof typeof fontSizes) => fontSizes[size],
  sizes: (size: keyof typeof sizes) => sizes[size],
};

export const utils = {
  paddingX: (padding: keyof typeof spacing) => ({
    paddingLeft: spacing[padding],
    paddingRight: spacing[padding],
  }),
  paddingY: (padding: keyof typeof spacing) => ({
    paddingTop: spacing[padding],
    paddingBottom: spacing[padding],
  }),
  marginX: (margin: keyof typeof spacing) => ({
    marginLeft: spacing[margin],
    marginRight: spacing[margin],
  }),
  marginY: (margin: keyof typeof spacing) => ({
    marginTop: spacing[margin],
    marginBottom: spacing[margin],
  }),
};

export const useHoverStyle = <T extends HTMLElement>(
  styles: React.CSSProperties
): [React.RefObject<T>, React.CSSProperties] => {
  const [isHovering, setHovering] = React.useState(false);
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (ref.current) {
      const mouseOverListener = () => setHovering(true);
      ref.current.addEventListener("mouseover", mouseOverListener);
      const mouseOutListener = () => setHovering(false);
      ref.current.addEventListener("mouseout", mouseOutListener);

      return () => {
        ref.current?.removeEventListener("mouseover", mouseOverListener);
        ref.current?.removeEventListener("mouseout", mouseOutListener);
      };
    }
  }, []);

  return [ref, isHovering ? styles : {}];
};
