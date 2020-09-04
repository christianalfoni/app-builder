import * as React from "react";
import { BaseType, ValueType } from "../../../types";
import { useBackendTypes } from "../../backend";
import { tokens, useHoverStyle, utils } from "../../styles";
import { VscAdd, VscClose } from "react-icons/vsc";
import { Input } from "../../ui-components/Input";
import { Button } from "../../ui-components/Button";

const baseTypeLabels: { [key: string]: string } = {
  string: '"abc"',
  number: "123",
  boolean: "true/false",
  null: "NULL",
};

const RecordBaseTypeEditor: React.FC<{
  addType: (baseType: BaseType, defaultValue: any) => void;
}> = ({ addType }) => {
  const [record, setRecord] = React.useState<{ [key: string]: string[] }>({});
  const [newKey, setNewKey] = React.useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setRecord((current) => ({ ...current, [newKey]: ["string"] }));
    setNewKey("");
  }

  return (
    <div>
      <h2>Record</h2>
      <div
        style={{
          fontSize: tokens.fontSizes("big"),
          fontWeight: "bold",
        }}
      >
        {"{"}
      </div>
      <div
        style={{
          paddingLeft: tokens.spacing(1),
        }}
      >
        <div
          style={{
            ...utils.marginY(1),
          }}
        >
          {Object.keys(record).map((key) => {
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: tokens.spacing(2),
                }}
              >
                <div
                  style={{
                    fontSize: tokens.fontSizes("big"),
                  }}
                >
                  {key}:
                </div>
                <div
                  style={{
                    marginLeft: tokens.spacing(1),
                  }}
                >
                  <TypesSelector
                    types={record[key]}
                    onChange={(newType) => {
                      setRecord((current) => ({
                        ...current,
                        [key]: current[key]
                          ? current[key].concat(newType.name)
                          : [newType.name],
                      }));
                    }}
                  />
                </div>
              </div>
            );
          })}
          <form
            onSubmit={onSubmit}
            style={{
              marginTop: tokens.spacing(2),
            }}
          >
            <Input
              placeholder="Enter record key..."
              value={newKey}
              onChange={setNewKey}
            />
          </form>
        </div>
      </div>
      <div
        style={{
          fontSize: tokens.fontSizes("big"),
          fontWeight: "bold",
        }}
      >
        {"}"}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: tokens.spacing(2),
        }}
      >
        <div
          style={{
            alignSelf: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              addType(
                {
                  type: "record",
                  descriptor: record,
                },
                {}
              );
            }}
          >
            add
          </Button>
        </div>
      </div>
    </div>
  );
};

const ListBaseTypeEditor: React.FC = () => null;

const DictionaryBaseTypeEditor: React.FC = () => null;

const SequenceBaseTypeEditor: React.FC = () => null;

const StringBaseTypeEditor: React.FC = () => null;

const NumberBaseTypeEditor: React.FC = () => null;

const BooleanBaseTypeEditor: React.FC = () => null;

const baseTypeEditors = {
  Record: RecordBaseTypeEditor,
  List: ListBaseTypeEditor,
  Dictionary: DictionaryBaseTypeEditor,
  Sequence: SequenceBaseTypeEditor,
  string: StringBaseTypeEditor,
  number: NumberBaseTypeEditor,
  boolean: BooleanBaseTypeEditor,
};

const TypeCreator: React.FC<{ close: () => void }> = ({ close }) => {
  const [_, setTypes] = useBackendTypes();
  const [baseType, setBaseType] = React.useState<keyof typeof baseTypeEditors>(
    "Dictionary"
  );
  const [name, setName] = React.useState("");
  const BaseEditor = baseTypeEditors[baseType];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        backgroundColor: tokens.colors.sideBar("background"),
        color: tokens.colors.sideBar("foreground"),
        border: tokens.colors.sideBar("border"),
        ...utils.paddingY(2),
        ...utils.paddingX(3),
        borderRadius: tokens.radii(1),
      }}
    >
      <h2>Add Type</h2>
      <div
        style={{
          position: "absolute",
          top: tokens.spacing(1),
          right: tokens.spacing(2),
          cursor: "pointer",
        }}
        onClick={() => {
          close();
        }}
      >
        <VscClose size={20} />
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={typeStyle("Dictionary", baseType === "Dictionary")}
          onClick={() => setBaseType("Dictionary")}
        >
          {"{dictionary}"}
        </div>
        <div
          style={typeStyle("Record", baseType === "Record")}
          onClick={() => setBaseType("Record")}
        >
          {"{record}"}
        </div>
        <div
          style={typeStyle("List", baseType === "List")}
          onClick={() => setBaseType("List")}
        >
          {"[list]"}
        </div>
        <div
          style={typeStyle("Sequence", baseType === "Sequence")}
          onClick={() => setBaseType("Sequence")}
        >
          {"[sequence]"}
        </div>
        <div
          style={typeStyle("string", baseType === "string")}
          onClick={() => setBaseType("string")}
        >
          {baseTypeLabels.string}
        </div>
        <div
          style={typeStyle("number", baseType === "number")}
          onClick={() => setBaseType("number")}
        >
          {baseTypeLabels.number}
        </div>
        <div
          style={typeStyle("boolean", baseType === "boolean")}
          onClick={() => setBaseType("boolean")}
        >
          {baseTypeLabels.boolean}
        </div>
      </div>
      <div
        style={{
          padding: tokens.spacing(2),
        }}
      >
        <div
          style={{
            marginBottom: tokens.spacing(2),
          }}
        >
          <Input
            value={name}
            onChange={setName}
            placeholder="Enter name of type..."
          />
        </div>
        <BaseEditor
          addType={(baseType, defaultValue) => {
            setTypes((current) => ({
              ...current,
              [name]: {
                name,
                baseType,
                defaultValue,
              },
            }));
            close();
          }}
        />
      </div>
    </div>
  );
};

const typeStyle = (type: string, isActive: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
  height: tokens.sizes("inputHeight"),
  background: isActive
    ? tokens.colors.list("activeSelectionBackground")
    : undefined,
  color: isActive ? tokens.colors.list("activeSelectionForeground") : undefined,
  borderRadius: tokens.radii(1),
  ...utils.paddingY(1),
  ...utils.paddingX(2),
  cursor: "pointer",
  marginLeft: tokens.spacing(1),
});

const TypesSelector: React.FC<{
  types: string[];
  onChange: (name: ValueType) => void;
}> = ({ types: typeNames, onChange }) => {
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
            style={typeStyle(name, typeNames.includes(name))}
            onClick={() => onChange(types[name])}
          >
            {baseTypeLabels[name] || name}
          </div>
        );
      })}
    </div>
  );
};

export const TypesEditor: React.FC<{
  types: string[];
  onChange: (name: ValueType) => void;
}> = ({ types, onChange }) => {
  const [ref, hoverStyle] = useHoverStyle<HTMLDivElement>({
    backgroundColor: tokens.colors.button("secondaryHoverBackground"),
  });
  const [showTypeCreator, setShowTypeCreator] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <TypesSelector types={types} onChange={onChange} />
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
          marginLeft: tokens.spacing(1),
        }}
        onClick={() => {
          setShowTypeCreator(true);
        }}
      >
        <VscAdd />
      </div>
      {showTypeCreator ? (
        <TypeCreator close={() => setShowTypeCreator(false)} />
      ) : null}
    </div>
  );
};
