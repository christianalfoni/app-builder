import { State } from "../types";

export class LibraryManager {
  private getLibraryState(state: State) {
    return `
	const observables = {
	  ${Object.keys(state).reduce((aggr, name) => {
      return `${aggr}
	  "${name}": observable.box(${state[name].value}),
		`;
    }, "")}		
	}
	export const state = {
	  ${Object.keys(state).reduce((aggr, name) => {
      return `${aggr}
	  get "${name}"() {
		return observables[${name}].get()
	  },
	  set "${name}"(newValue) {
		observables[${name}].set(newValue)  
	  },`;
    }, "")}	
	}
		  `;
  }

  getFile(data: { state: State }) {
    let file = `import { observable } from 'mobx'
	import { observer } from 'mobx-react-lite'
	
	export const component = observer
	`;

    file += this.getLibraryState(data.state);

    return file;
  }
}
