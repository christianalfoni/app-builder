import * as React from "react";
import * as CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import { Types, ValueType } from "../../../types";
import { useBackendTypes } from "../../backend";
import { tokens } from "../../styles";
import debounce from "lodash.debounce";

function validateValue(value: any, typeNames: string[], types: Types) {
  try {
    const parsedValue = JSON.parse(value);

    return typeNames.reduce((aggr, typeName) => {
      if (aggr) return true;
      const type = types[typeName];
      if (type.name === "string" && typeof parsedValue === "string")
        return true;
      if (type.name === "number" && typeof parsedValue === "number")
        return true;
      if (type.name === "boolean" && typeof parsedValue === "boolean")
        return true;
      if (type.name === "null" && parsedValue === null) return true;
      return false;
    }, false);
  } catch {
    return false;
  }
}

export const StateValue: React.FC<{
  value: any;
  typeNames: string[];
  onChange: (value: any) => void;
}> = ({ value: initialValue, typeNames, onChange }) => {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState(initialValue);
  const [types] = useBackendTypes();

  const isValid = validateValue(value, typeNames, types);

  const debouncedOnChange = React.useCallback(debounce(onChange, 500), []);

  React.useLayoutEffect(() => {
    const instance = CodeMirror.fromTextArea(ref.current!, {
      mode: "javascript",
      viewportMargin: Infinity,
    });
    instance.on("change", (event) => {
      setValue(event.getValue());
    });
  }, []);
  React.useEffect(() => {
    if (isValid) {
      debouncedOnChange(value);
    }
  }, [isValid, value]);
  return (
    <div
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isValid
          ? "transparent"
          : tokens.colors.inputValidation("errorBorder"),
      }}
    >
      <textarea ref={ref} defaultValue={value} />
    </div>
  );
};
