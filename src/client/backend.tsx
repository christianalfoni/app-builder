import * as React from "react";
import { Init, InitData, State, Types } from "../types";

// @ts-ignore
const vscode = acquireVsCodeApi();

// const oldState = vscode.getState();

export type IncomingMessage =
  | {
      type: "init";
      data: Init;
    }
  | {
      type: "state";
      data: State;
    }
  | {
      type: "types";
      data: Types;
    };

export type InitListener = (state: Init) => void;

export type StateListener = (state: State) => void;

export type TypesListener = (types: Types) => void;

/*
    LISTENERS
*/

const listeners = {
  init: [] as InitListener[],
  state: [] as StateListener[],
};

window.addEventListener("message", (event) => {
  const message: IncomingMessage = event.data;
  console.log(JSON.stringify(message, null, 2));
  switch (message.type) {
    case "init":
      listeners.init.forEach((listener) => listener(message.data));
      break;
  }
});

export const onInit = (listener: InitListener) => {
  listeners.init.push(listener);
  return () => {
    listeners.init.splice(listeners.init.indexOf(listener), 1);
  };
};

export const onState = (listener: StateListener) => {
  listeners.state.push(listener);
  return () => {
    listeners.state.splice(listeners.state.indexOf(listener), 1);
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
  vscode.postMessage({
    type: "state",
    data: state,
  });
};

export const sendTypes = (types: Types) => {
  vscode.postMessage({
    type: "types",
    data: types,
  });
};

/*
  PROVIDER
*/
export type Backend = Init & {
  sendState(state: State): void;
};
const initialBackend: Backend = {
  status: "pending",
  sendState,
};
const context = React.createContext<Backend>(initialBackend);

export const useBackend = () => {
  return React.useContext(context);
};

function createDataHook<T extends keyof InitData>(
  dataKey: T,
  sendUpdate: (update: InitData[T]) => void
) {
  const listeners: ((update: InitData[T]) => void)[] = [];

  return (): [
    InitData[T],
    (update: (currentData: InitData[T]) => InitData[T]) => void
  ] => {
    const backend = useBackend();
    const [data, setData] = React.useState<InitData[T]>(
      backend.status === "ready" ? backend[dataKey] : {}
    );

    React.useEffect(() => {
      const listener: (update: InitData[T]) => void = (update) => {
        setData(update);
      };
      listeners.push(listener);
      return () => {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    });

    return [
      data,
      (update) => {
        const dataUpdate = update(data);
        listeners.forEach((listener) => {
          listener(dataUpdate);
        });
        sendUpdate(dataUpdate);
      },
    ];
  };
}

export const useBackendState = createDataHook("state", sendState);
export const useBackendTypes = createDataHook("types", sendTypes);

export const BackendProvider: React.FC = ({ children }) => {
  const [backend, setBackend] = React.useState<Backend>(initialBackend);

  React.useEffect(() => {
    sendInit();
    return onInit((init) => setBackend((current) => ({ ...current, ...init })));
  }, []);

  return <context.Provider value={backend}>{children}</context.Provider>;
};
