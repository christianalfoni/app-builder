import * as React from "react";
import * as CodeMirror from "codemirror";
import "codemirror/mode/javascript/javascript";
import { Types, ValueType } from "../../../types";
import { useBackendTypes } from "../../backend";
import { tokens } from "../../styles";
import debounce from "lodash.debounce";

function validateParsedValue(
  parsedValue: any,
  typeNames: string[],
  types: Types
): boolean {
  return typeNames.reduce((aggr, typeName) => {
    if (aggr) return true;

    const type = types[typeName];

    if (type.name === "string" && typeof parsedValue === "string") return true;
    if (type.name === "number" && typeof parsedValue === "number") return true;
    if (type.name === "boolean" && typeof parsedValue === "boolean")
      return true;
    if (type.name === "null" && parsedValue === null) return true;
    if ("baseType" in type && type.baseType.type === "dictionary") {
      return Object.keys(parsedValue).reduce((subAggr, key) => {
        if (!subAggr) return subAggr;

        return validateParsedValue(
          parsedValue[key],
          type.baseType.descriptor as string[],
          types
        );
      }, true);
    }

    if ("baseType" in type && type.baseType.type === "record")
      return Object.keys(parsedValue).reduce((subAggr, key) => {
        if (!subAggr) return subAggr;

        return validateParsedValue(
          parsedValue[key],
          (type.baseType.descriptor as any)[key] as string[],
          types
        );
      }, Object.keys(parsedValue).length === Object.keys(type.baseType.descriptor).length);

    return aggr;
  }, false) as any; // WTF typescript?
}
function validateValue(value: any, typeNames: string[], types: Types) {
  try {
    const parsedValue = new Function(`return ${value}`)();

    return validateParsedValue(parsedValue, typeNames, types);
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

  const debouncedOnChange = React.useCallback(debounce(onChange, 500), [
    onChange,
  ]);

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
