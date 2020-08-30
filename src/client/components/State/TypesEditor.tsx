import * as React from "react";
import { ValueType } from "../../../types";
import { useBackendTypes } from "../../backend";
import { tokens, utils } from "../../styles";

const typeStyle = (type: string, currentType: string): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  height: tokens.sizes("inputHeight"),
  background:
    currentType === type
      ? tokens.colors.list("activeSelectionBackground")
      : undefined,
  color:
    currentType === type
      ? tokens.colors.list("activeSelectionForeground")
      : undefined,
  borderRadius: tokens.radii(1),
  ...utils.paddingY(1),
  ...utils.paddingX(2),
  cursor: "pointer",
  marginLeft: tokens.spacing(1),
});

const baseTypeLabels: { [key: string]: string } = {
  string: '"abc"',
  number: "123",
  boolean: "true/false",
  null: "NULL",
};

export const TypesEditor: React.FC<{
  type: string;
  onChange: (name: ValueType) => void;
}> = ({ type, onChange }) => {
  const [types, setTypes] = useBackendTypes();

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {Object.keys(types).map((name) => {
        return (
          <div
            key={name}
            style={typeStyle(name, type)}
            onClick={() => onChange(types[name])}
          >
            {baseTypeLabels[name] || name}
          </div>
        );
      })}
    </div>
  );
};

/*

      <div
        style={stateTypeStyle("Number", type)}
        onClick={() => changeStateType("Number", 0, path)}
      >
        123
      </div>
      <div
        style={stateTypeStyle("Boolean", type)}
        onClick={() => changeStateType("Boolean", false, path)}
      >
        true/false
      </div>
      <div
        style={stateTypeStyle("Dictionary", type)}
        onClick={() => changeStateType("Dictionary", {}, path)}
      >
        {"{...}"}
      </div>
      <div
        style={stateTypeStyle("List", type)}
        onClick={() => changeStateType("List", [], path)}
      >
        {"[...]"}
      </div>
      <div
        style={stateTypeStyle("Record", type)}
        onClick={() => changeStateType("Record", {}, path)}
      >
        {"{ }"}
      </div>
      <div
        style={stateTypeStyle("Sequence", type)}
        onClick={() => changeStateType("Sequence", [], path)}
      >
        {"[ ]"}
      </div>
*/
