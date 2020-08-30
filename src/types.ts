export type State = {
  [name: string]: StateValue;
};

export type BaseType =
  | {
      type: "string";
      descriptor: string;
    }
  | {
      type: "number";
      descriptor: number;
    }
  | {
      type: "boolean";
      descriptor: boolean;
    }
  | {
      type: "dictionary";
      descriptor: string;
    }
  | {
      type: "record";
      descriptor: {
        [key: string]: string;
      };
    }
  | {
      type: "sequence";
      descriptor: string[];
    };

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
      baseType: BaseType[];
    };

export type StateValue = {
  type: ValueType;
  value: any;
};

export type PackageJson = {
  dependencies?: { [name: string]: string };
};

export type Types = {
  [name: string]: ValueType;
};

export type InitData = {
  state: State;
  types: Types;
};

export type Init =
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
  | ({
      status: "ready";
      path: string;
    } & InitData);
