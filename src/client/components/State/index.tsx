import * as React from "react";
import { useBackend, useBackendState } from "../../backend";
import { tokens } from "../../styles";
import { AddState } from "./AddState";
import { List } from "./List";
import { StateEditor } from "./StateEditor";

export const State: React.FC = () => {
  const [state] = useBackendState();
  const [selected, setSelected] = React.useState<string | null>(null);
  const onSelect = React.useCallback((name: string) => setSelected(name), []);

  return (
    <div
      style={{
        display: "flex",
        padding: tokens.spacing(2),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexBasis: "250px",
        }}
      >
        <AddState />
        <List selected={selected} onSelect={onSelect} />
      </div>
      <div
        style={{
          flex: 1,
          marginLeft: tokens.spacing(3),
        }}
      >
        {selected ? (
          <StateEditor name={selected} state={state[selected]} />
        ) : null}
      </div>
    </div>
  );
};
