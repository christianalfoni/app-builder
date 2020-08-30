import * as React from "react";
import { State, StateValue } from "../../../types";
import { useBackendState } from "../../backend";
import { tokens, useHoverStyle, utils } from "../../styles";

const ListItem: React.FC<{
  name: string;
  state: StateValue;
  onSelect: (name: string) => void;
  selected: boolean;
}> = React.memo(({ name, state, selected, onSelect }) => {
  const [ref, hoverStyle] = useHoverStyle<HTMLLIElement>({
    background: tokens.colors.list("activeSelectionBackground"),
    color: tokens.colors.list("activeSelectionForeground"),
  });
  return (
    <li
      key={name}
      ref={ref}
      style={{
        borderRadius: tokens.radii(1),
        cursor: "pointer",
        ...utils.paddingX(3),
        ...utils.paddingY(2),
        background: selected
          ? tokens.colors.list("focusBackground")
          : undefined,
        color: selected ? tokens.colors.list("focusForeground") : undefined,
        marginBottom: tokens.spacing(1),
        ...hoverStyle,
      }}
      onClick={() => onSelect(name)}
    >
      <span
        style={{
          fontWeight: "bold",
          fontSize: tokens.fontSizes("big"),
        }}
      >
        {name}
      </span>{" "}
      <span
        style={{
          fontSize: tokens.fontSizes("small"),
        }}
      >
        {state.type.name}
      </span>
    </li>
  );
});

export const List: React.FC<{
  selected: string | null;
  onSelect: (name: string) => void;
}> = ({ selected, onSelect }) => {
  const [state] = useBackendState();

  return (
    <ul
      style={{
        listStyleType: "none",
        padding: 0,
      }}
    >
      {Object.keys(state).map((name) => {
        return (
          <ListItem
            key={name}
            name={name}
            state={state[name]}
            selected={selected === name}
            onSelect={onSelect}
          />
        );
      })}
    </ul>
  );
};
