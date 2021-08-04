import {handleKeyPress} from "./keyboard"
import * as roamClient from "roam-client"
import {Block} from "roam-client"

import './execution-style.css'

console.log("Loading iroam.")

document.addEventListener("keydown", handleKeyPress)

// Exposing all the utilities to be more easily accessible in the notebook.
window.roamClient = roamClient
window.block = Block.fromUid
