export type State = {
  [name: string]: StateValue;
};

export type StringBaseType = {
  type: "string";
  descriptor: string;
};

export type NumberBaseType = {
  type: "number";
  descriptor: number;
};

export type BooleanBaseType = {
  type: "boolean";
  descriptor: boolean;
};

export type DictionaryBaseType = {
  type: "dictionary";
  descriptor: string[];
};

export type RecordBaseType = {
  type: "record";
  descriptor: {
    [key: string]: string[];
  };
};

export type SequenceBaseType = {
  type: "sequence";
  descriptor: string[];
};

export type BaseType =
  | StringBaseType
  | NumberBaseType
  | BooleanBaseType
  | DictionaryBaseType
  | RecordBaseType
  | SequenceBaseType;

export type ValueType =
  | {
      name: "string";
      defaultValue: string;
    }
  | {
      name: "number";
      defaultValue: number;
    }
  | {
      name: "boolean";
      defaultValue: boolean;
    }
  | { name: "null"; defaultValue: null }
  | {
      name: string;
      defaultValue: any;
      baseType: BaseType;
    };

export type StateValue = {
  type: string[];
  value: any;
};

export type PackageJson = {
  dependencies?: { [name: string]: string };
};

export type Types = {
  [name: string]: ValueType;
};

export type Backend =
  | {
      status: "pending";
    }
  | {
      status: "no-project";
    }
  | {
      status: "missing-dependencies";
      path: string;
    }
  | {
      status: "ready";
      path: string;
    };
