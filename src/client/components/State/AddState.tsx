import * as React from "react";
import { useBackend, useBackendState, useBackendTypes } from "../../backend";
import { tokens, useHoverStyle, utils } from "../../styles";
import { VscAdd } from "react-icons/vsc";
import { Input } from "../../ui-components/Input";

export const AddState: React.FC = () => {
  const [state, setState] = useBackendState();
  const [types, _] = useBackendTypes();
  const [isAdding, setAdding] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [ref, hoverStyle] = useHoverStyle<HTMLDivElement>({
    backgroundColor: tokens.colors.button("secondaryHoverBackground"),
  });

  React.useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAdding(false);
      }
    };
    global.addEventListener("keydown", listener);
    return () => {
      global.removeEventListener("keydown", listener);
    };
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState((current) => ({
      ...current,
      [inputValue]: {
        type: [types.string.name],
        value: types.string.defaultValue,
      },
    }));
    setInputValue("");
    setAdding(false);
  }

  if (isAdding) {
    return (
      <form onSubmit={onSubmit}>
        <Input value={inputValue} onChange={setInputValue} autoFocus />
      </form>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        height: tokens.sizes("inputHeight"),
        boxSizing: "border-box",
        backgroundColor: tokens.colors.button("secondaryBackground"),
        color: tokens.colors.button("secondaryForeground"),
        cursor: "pointer",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: tokens.radii(1),
        ...utils.paddingY(2),
        ...utils.paddingX(3),
        ...hoverStyle,
      }}
      onClick={() => {
        setAdding(true);
      }}
    >
      add state
      <VscAdd color={tokens.colors.button("secondaryForeground")} />
    </div>
  );
};
