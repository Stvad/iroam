# iRoam - interactive computation in Roam

Based on work of @aidam38 on PyRoam : http://adamkrivka.com/roam-plugins/pyroam

## Usage

[Install Roam plugin](https://roamstack.com/how-install-roam-plugin/) via the following code-block

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

## Contributing


If you want to develop this plugin, you need to clone this repository, run `npm install` or `yarn install` and then `npm run dev` `yarn run dev`. The final script will be hosted at `localhost:1234/iroam.js` (or something else, the bundler will tell you), so you should replace the `src` of the script in Roam with that. 
