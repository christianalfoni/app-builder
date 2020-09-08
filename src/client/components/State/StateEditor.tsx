import * as React from "react";
import { StateValue } from "../../../types";
import { useBackendState, useBackendTypes } from "../../backend";
import { tokens } from "../../styles";
import { StateValue as StateValueEditor } from "./StateValue";
import { TypesEditor } from "./TypesEditor";

type ChangeStateType = (type: string) => void;
type ChangeStateValue = (value: any) => void;

const StateType: React.FC<{
  typeNames: string[];
  value: any;
  changeStateType: ChangeStateType;
  changeStateValue: ChangeStateValue;
}> = ({ typeNames, value, changeStateType, changeStateValue }) => {
  return (
    <div>
      <TypesEditor
        types={typeNames}
        onChange={(type) => {
          changeStateType(type.name);
        }}
      />
      <div
        style={{
          padding: tokens.spacing(2),
        }}
      >
        <StateValueEditor
          value={value}
          typeNames={typeNames}
          onChange={(value) => {
            changeStateValue(value);
          }}
        />
      </div>
    </div>
  );
};

export const StateEditor: React.FC<{ name: string; state: StateValue }> = ({
  name,
  state,
}) => {
  const [_, setState] = useBackendState();
  const [types] = useBackendTypes();
  const changeStateType: ChangeStateType = (typeName) => {
    setState((current) => {
      let type: string[];

      if (current[name].type.includes(typeName)) {
        type = current[name].type.filter(
          (existingTypeName) => existingTypeName !== typeName
        );
      } else {
        type = current[name].type.concat(typeName);
      }

      return {
        ...current,
        [name]: {
          type,
          value: current[name].value,
        },
      };
    });
  };
  const changeStateValue: ChangeStateValue = (value) => {
    setState((current) => {
      return {
        ...current,
        [name]: {
          type: current[name].type,
          value,
        },
      };
    });
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <StateType
        typeNames={state.type}
        value={state.value}
        changeStateType={changeStateType}
        changeStateValue={changeStateValue}
      />
    </div>
  );
};
