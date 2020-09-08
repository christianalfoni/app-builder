import * as React from "react";
import { Backend, State, Types } from "../types";

// @ts-ignore
const vscode = acquireVsCodeApi();

// const oldState = vscode.getState();

export type IncomingMessage =
  | {
      type: "init";
      data: Backend;
    }
  | {
      type: "state";
      data: State;
    }
  | {
      type: "types";
      data: Types;
    };

export type BackendListener = (init: Backend) => void;

export type StateListener = (state: State) => void;

export type TypesListener = (types: Types) => void;

/*
    LISTENERS
*/

const listeners = {
  backend: [] as BackendListener[],
  state: [] as StateListener[],
  types: [] as TypesListener[],
};

window.addEventListener("message", (event) => {
  const message: IncomingMessage = event.data;
  switch (message.type) {
    case "init":
      listeners.backend.forEach((listener) => listener(message.data));
      break;
    case "state":
      listeners.state.forEach((listener) => listener(message.data));
      break;
    case "types":
      listeners.types.forEach((listener) => listener(message.data));
  }
});

const onBackend = (listener: BackendListener) => {
  listeners.backend.push(listener);
  return () => {
    listeners.backend.splice(listeners.backend.indexOf(listener), 1);
  };
};

const onState = (listener: StateListener) => {
  listeners.state.push(listener);
  return () => {
    listeners.state.splice(listeners.state.indexOf(listener), 1);
  };
};

const onTypes = (listener: TypesListener) => {
  listeners.types.push(listener);
  return () => {
    listeners.types.splice(listeners.types.indexOf(listener), 1);
  };
};

/*
  Send messages
*/

export const sendInit = () => {
  vscode.postMessage({
    type: "init",
  });
};

export const sendState = (state: State) => {
  listeners.state.forEach((listener) => listener(state));
  vscode.postMessage({
    type: "state",
    data: state,
  });
};

export const sendTypes = (types: Types) => {
  listeners.types.forEach((listener) => listener(types));
  vscode.postMessage({
    type: "types",
    data: types,
  });
};

/*
  PROVIDERS
*/

const backendContext = React.createContext<Backend>(null as any);

export const useBackend = () => {
  return React.useContext(backendContext);
};

export const BackendProvider: React.FC = ({ children }) => {
  const [backend, setBackend] = React.useState<Backend>({
    status: "pending",
  });

  React.useEffect(() => {
    sendInit();
    return onBackend((backend) => setBackend(backend));
  }, []);

  return (
    <backendContext.Provider value={backend}>
      {children}
    </backendContext.Provider>
  );
};

const stateContext = React.createContext<State>({});

export const useBackendState = (): [
  State,
  (update: (current: State) => State) => void
] => {
  const value = React.useContext(stateContext);

  return [value, (update) => sendState(update(value))];
};

export const BackendStateProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<State>({});

  React.useEffect(() => onState((state) => setState(state)), []);

  return (
    <stateContext.Provider value={state}>{children}</stateContext.Provider>
  );
};

const typesContext = React.createContext<Types>({});

export const useBackendTypes = (): [
  Types,
  (update: (current: Types) => Types) => void
] => {
  const value = React.useContext(typesContext);

  return [value, (update) => sendTypes(update(value))];
};

export const BackendTypesProvider: React.FC = ({ children }) => {
  const [types, setTypes] = React.useState<Types>({});

  React.useEffect(() => onTypes((types) => setTypes(types)), []);

  return (
    <typesContext.Provider value={types}>{children}</typesContext.Provider>
  );
};
