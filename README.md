# iRoam - interactive computation in Roam

Based on [Observable](https://observablehq.com/) runtime

## Usage

Create a `javascript` code block in Roam and write [Observable style JS code](https://observablehq.com/@observablehq/observables-not-javascript) in it.  
Use one of the shortcuts below to execute it. 

### Shortcuts

- `<Cmd+Enter>`	Run current cell
- `<Alt+Enter>`	Run current cell and create a new one below 
- `<Cmd+Shift+Enter>` Run all cells in the active notebook

### Notebooks

By default, the current page considered to be an "active notebook", i.e., when you press `<Cmd+Shift+Enter>`, all blocks on the current page get executed.

You can designate a smaller portion of the page to be the active notebook by referencing the page [[iroam/notebook]] in the parent block, i.e. all blocks nested under this blocks will get run when pressing `<Cmd+Shift+Enter>`, but no other. 

Each notebook lives in an isolated Observable environment (Observable runtime module)

### Dependency management

You can import dependencies/shared code from:
- public Observable notebooks: https://observablehq.com/@observablehq/introduction-to-imports
- NPM: https://observablehq.com/@observablehq/require

### Examples

## Installation

1. [Install Roam plugin](https://roamstack.com/how-install-roam-plugin/) via the following code-block

```javascript
/** iroam - Interactive computation in Roam
 *  Author: Vlad Sitalo
 *  Docs: https://github.com/Stvad/iroam
 */

window.iroamSettings = {
  /** There might some important settings here in the future,
   *   make sure to check the docs once in a while.
   */
}

var iroamID = "iroam-script";
var oldiroam = document.getElementById(iroamID);
if (oldiroam) oldiroam.remove();
var iroam = document.createElement('script');
    iroam.type = "text/javascript";
    iroam.id = iroamID;
	iroam.src =  "https://i.roam.garden/iroam.js";
    iroam.async = true;
document.getElementsByTagName('head')[0].appendChild(iroam);
```

2. Add a **CSS block** with the content of [this file](./src/execution-style.css) to make the result blocks look nicer.

## Known issues
- Execution of the whole notebook would fail if some of the code blocks are in collapsed state
- Currently, relies on a custom version of https://github.com/Stvad/roam-client to provide better Roam data interfaces/reactivity

## Contributing


If you want to develop this plugin, you need to clone this repository, run `npm install` or `yarn install` and then `npm run dev` `yarn run dev`. The final script will be hosted at `localhost:1234/iroam.js` (or something else, the bundler will tell you), so you should replace the `src` of the script in Roam with that. 

## Credits

Based on work of @aidam38 on PyRoam : http://adamkrivka.com/roam-plugins/pyroam
