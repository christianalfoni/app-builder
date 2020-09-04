import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { APP_DIR, CONFIGURATION_DIR } from "../constants";
import { State, Types } from "../types";
import { LibraryManager } from "./LibraryManager";

export class FilesManager {
  private libraryManager = new LibraryManager();
  private currentState: State = {};
  private currentTypes: Types = {};

  private async ensureConfigurationDir() {
    const dir = this.getWorkspacePath(CONFIGURATION_DIR)!;

    try {
      await fs.promises.mkdir(dir);
    } catch {
      // Already exists
    }
  }

  private async writeLibrary() {
    const libraryFile = this.getWorkspacePath(APP_DIR, "app.js")!;

    await fs.promises.writeFile(
      libraryFile,
      this.libraryManager.getFile({
        state: this.currentState,
      })
    );
  }

  getWorkspacePath(...subdir: string[]) {
    return (
      vscode.workspace.workspaceFolders &&
      path.join(vscode.workspace.workspaceFolders[0].uri.path, ...subdir)
    );
  }
  async getState() {
    this.ensureConfigurationDir();
    const file = this.getWorkspacePath(CONFIGURATION_DIR, "state.json")!;
    try {
      const content = await fs.promises.readFile(file);

      this.currentState = JSON.parse(content.toString());
    } catch {
      const content = {};
      await fs.promises.writeFile(file, JSON.stringify(content));
      this.currentState = content;
    }

    return this.currentState;
  }
  async getTypes() {
    this.ensureConfigurationDir();
    const file = this.getWorkspacePath(CONFIGURATION_DIR, "types.json")!;
    try {
      const content = await fs.promises.readFile(file);

      this.currentTypes = JSON.parse(content.toString());
    } catch {
      const content: Types = {
        string: {
          name: "string",
          defaultValue: '""',
        },
        number: {
          name: "number",
          defaultValue: 0,
        },
        boolean: {
          name: "boolean",
          defaultValue: false,
        },
        null: {
          name: "null",
          defaultValue: null,
        },
      };
      await fs.promises.writeFile(file, JSON.stringify(content));
    }

    return this.currentTypes;
  }
  async writeState(state: State) {
    await this.ensureConfigurationDir();

    const file = this.getWorkspacePath(CONFIGURATION_DIR, "state.json")!;

    this.currentState = state;
    await fs.promises.writeFile(file, JSON.stringify(state));
    await this.writeLibrary();
  }
  async writeTypes(types: Types) {
    await this.ensureConfigurationDir();

    const file = this.getWorkspacePath(CONFIGURATION_DIR, "types.json")!;

    this.currentTypes = types;
    await fs.promises.writeFile(file, JSON.stringify(types));
  }
}
