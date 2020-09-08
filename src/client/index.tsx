import * as React from "react";
import { render } from "react-dom";
import {
  BackendProvider,
  BackendStateProvider,
  BackendTypesProvider,
} from "./backend";
import { App } from "./components/App";

render(
  <BackendProvider>
    <BackendStateProvider>
      <BackendTypesProvider>
        <App />
      </BackendTypesProvider>
    </BackendStateProvider>
  </BackendProvider>,
  document.querySelector("#app")
);
