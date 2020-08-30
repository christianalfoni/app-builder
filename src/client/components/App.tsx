import * as React from "react";
import { useBackend } from "../backend";
import { tokens } from "../styles";
import { Tab, Tabs } from "../ui-components/Tabs";
import { State } from "./State";

const pages = {
  state: State,
  effects: () => null,
};

export const App: React.FC = () => {
  const backend = useBackend();
  const [currentPage, setCurrentPage] = React.useState<keyof typeof pages>(
    "state"
  );

  const Page = pages[currentPage];

  if (backend.status === "pending") {
    return (
      <div
        style={{
          padding: tokens.spacing(3),
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  if (backend.status === "no-project") {
    return (
      <div
        style={{
          padding: tokens.spacing(3),
        }}
      >
        <h1>Please open and initialize a project with a package.json file</h1>
      </div>
    );
  }

  if (backend.status === "missing-dependencies") {
    return (
      <div
        style={{
          padding: tokens.spacing(3),
        }}
      >
        <h1>
          The project requires mobx, mobx-react-lite and react as dependencies
        </h1>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: tokens.spacing(3),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs>
        <Tab
          active={currentPage === "state"}
          onClick={() => setCurrentPage("state")}
        >
          State
        </Tab>
        <Tab
          active={currentPage === "effects"}
          onClick={() => setCurrentPage("effects")}
        >
          Effects
        </Tab>
      </Tabs>
      <Page />
    </div>
  );
};
