import {handleKeyPress} from "./keyboard"
import * as roamClient from "roam-client"
import {Block, Page} from "roam-client"

import './execution-style.css'
import {observe} from "./observable"

console.log("Loading iRoam")

document.addEventListener("keydown", handleKeyPress)

// Exposing all the utilities to be more easily accessible in the notebook.
window.roamClient = roamClient
window.block = Block.fromUid
window.observe = observe
window.page = Page.fromName
