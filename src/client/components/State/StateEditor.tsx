import * as React from "react";
import { StateValue, Types, ValueType } from "../../../types";
import { useBackendState, useBackendTypes } from "../../backend";
import { tokens, utils } from "../../styles";
import { Checkbox, Input, NumberInput } from "../../ui-components/Input";
import { TypesEditor } from "./TypesEditor";

type ChangeStateType = (type: string, value: any, path: string[]) => void;

const StateType: React.FC<{
  type: ValueType;
  value: any;
  changeStateType: ChangeStateType;
  path: string[];
}> = ({ type, value, changeStateType, path }) => {
  let Editor: React.FC<{
    value: any;
    changeStateType: ChangeStateType;
    path: string[];
  }> = () => null;

  if (type.name === "string") {
    Editor = StringEditor;
  }

  if (type.name === "number") {
    Editor = NumberEditor;
  }

  if (type.name === "boolean") {
    Editor = BooleanEditor;
  }

  return (
    <div>
      <TypesEditor
        type={type.name}
        onChange={(type) => {
          changeStateType(type.name, type.defaultValue, path);
        }}
      />
      <div
        style={{
          padding: tokens.spacing(2),
        }}
      >
        <Editor value={value} changeStateType={changeStateType} path={path} />
      </div>
    </div>
  );
};

const StringEditor: React.FC<{
  value: string;
  changeStateType: ChangeStateType;
  path: string[];
}> = ({ value: initialValue, changeStateType, path }) => {
  const [value, setValue] = React.useState(JSON.parse(initialValue));

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    changeStateType("string", `"${value}"`, path);
  }

  const hasChanged = JSON.parse(initialValue) !== value;

  return (
    <form onSubmit={onSubmit}>
      <Input
        autoFocus
        value={value}
        onChange={setValue}
        hasChanged={hasChanged}
      />
    </form>
  );
};

const NumberEditor: React.FC<{
  value: number;
  changeStateType: ChangeStateType;
  path: string[];
}> = ({ value: initialValue, changeStateType, path }) => {
  const [value, setValue] = React.useState(initialValue);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    changeStateType("number", value, path);
  }

  const hasChanged = value !== value;

  return (
    <form onSubmit={onSubmit}>
      <NumberInput
        autoFocus
        value={value}
        onChange={setValue}
        hasChanged={hasChanged}
      />
    </form>
  );
};

const BooleanEditor: React.FC<{
  value: boolean;
  changeStateType: ChangeStateType;
  path: string[];
}> = ({ value, changeStateType, path }) => {
  function setValue(newValue: boolean) {
    changeStateType("boolean", newValue, path);
  }

  return <Checkbox autoFocus value={value} onChange={setValue} />;
};

const DictionaryEditor: React.FC<{
  value: object;
  changeStateType: ChangeStateType;
  path: string[];
}> = ({ value, changeStateType, path }) => {
  return (
    <div>
      {Object.keys(value).map((key) => {
        return <div key={key}></div>;
      })}
    </div>
  );
};

export const StateEditor: React.FC<{ name: string; state: StateValue }> = ({
  name,
  state,
}) => {
  const [_, setState] = useBackendState();
  const [types] = useBackendTypes();

  const changeStateType = React.useCallback<ChangeStateType>(
    (type, value, path) => {
      setState((current) => ({
        ...current,
        [name]: { type: types[type], value },
      }));
    },
    []
  );
  return (
    <div>
      <StateType
        type={state.type}
        value={state.value}
        changeStateType={changeStateType}
        path={[]}
      />
    </div>
  );
};
