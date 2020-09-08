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

type BaseTypeEditorProps = {
  addType: (name: string, baseType: BaseType, defaultValue: any) => void;
};

const AddType: React.FC<{
  onAdd: (name: string) => void;
  disabled?: boolean;
}> = ({ onAdd, disabled }) => {
  const [name, setName] = React.useState("");

  return (
    <div
      style={{
        display: "flex",
        marginTop: tokens.spacing(2),
      }}
    >
      <Input
        value={name}
        disabled={Boolean(disabled)}
        onChange={setName}
        placeholder="Enter name of type..."
      />
      <Button
        disabled={disabled || !name}
        onClick={() => {
          onAdd(name);
        }}
      >
        add
      </Button>
    </div>
  );
};

const RecordBaseTypeEditor: React.FC<BaseTypeEditorProps> = ({ addType }) => {
  const [record, setRecord] = React.useState<{ [key: string]: string[] }>({});
  const [newKey, setNewKey] = React.useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setRecord((current) => ({ ...current, [newKey]: ["string"] }));
    setNewKey("");
  }

  return (
    <div>
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
                      setRecord((current) => {
                        if (
                          current[key] &&
                          current[key].includes(newType.name)
                        ) {
                          return {
                            ...current,
                            [key]: current[key].filter(
                              (existingType) => existingType !== newType.name
                            ),
                          };
                        }
                        return {
                          ...current,
                          [key]: current[key]
                            ? current[key].concat(newType.name)
                            : [newType.name],
                        };
                      });
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
      <AddType
        onAdd={(name) => {
          addType(
            name,
            {
              type: "record",
              descriptor: record,
            },
            {}
          );
        }}
      />
    </div>
  );
};

const ListBaseTypeEditor: React.FC = () => null;

const DictionaryBaseTypeEditor: React.FC<BaseTypeEditorProps> = ({
  addType,
}) => {
  const [types, setTypes] = React.useState<string[]>([]);

  return (
    <div>
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
        <TypesSelector
          types={types}
          onChange={(newType) => {
            setTypes((current) =>
              current.includes(newType.name)
                ? current.filter(
                    (existingType) => existingType !== newType.name
                  )
                : current.concat(newType.name)
            );
          }}
        />
      </div>
      <div
        style={{
          fontSize: tokens.fontSizes("big"),
          fontWeight: "bold",
        }}
      >
        {"}"}
      </div>
      <AddType
        disabled={!types.length}
        onAdd={(name) => {
          addType(
            name,
            {
              type: "dictionary",
              descriptor: types,
            },
            {}
          );
        }}
      />
    </div>
  );
};

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
  const BaseEditor = baseTypeEditors[baseType];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        zIndex: 5,
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
          style={typeStyle(baseType === "Dictionary")}
          onClick={() => setBaseType("Dictionary")}
        >
          {"{dictionary}"}
        </div>
        <div
          style={typeStyle(baseType === "Record")}
          onClick={() => setBaseType("Record")}
        >
          {"{record}"}
        </div>
        <div
          style={typeStyle(baseType === "List")}
          onClick={() => setBaseType("List")}
        >
          {"[list]"}
        </div>
        <div
          style={typeStyle(baseType === "Sequence")}
          onClick={() => setBaseType("Sequence")}
        >
          {"[sequence]"}
        </div>
        <div
          style={typeStyle(baseType === "string")}
          onClick={() => setBaseType("string")}
        >
          {baseTypeLabels.string}
        </div>
        <div
          style={typeStyle(baseType === "number")}
          onClick={() => setBaseType("number")}
        >
          {baseTypeLabels.number}
        </div>
        <div
          style={typeStyle(baseType === "boolean")}
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
        <BaseEditor
          addType={(name, baseType, defaultValue) => {
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

const typeStyle = (isActive: boolean): React.CSSProperties => ({
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
            style={typeStyle(typeNames.includes(name))}
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
