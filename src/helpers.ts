/* ====== BASIC ======= */

import {getUidOfClosestBlockReferencing} from "./api"
import {Settings} from "./settings"

export const sleep = (m) => {
  var t = m ? m : 10;
  return new Promise((r) => setTimeout(r, t));
};

export const addElementToPage = (element, tagId, typeT) => {
  try {
    document.getElementById(tagId).remove();
  } catch (e) { }
  Object.assign(element, { type: typeT, async: false, tagId: tagId });
  document.getElementsByTagName("head")[0].appendChild(element);
};

export const addScriptToPage = (tagId, script) => {
  addElementToPage(
    Object.assign(document.createElement("script"), { src: script }),
    tagId,
    "text/javascript"
  );
};

export function getActiveRoamInputElement() {
  const el = document.activeElement
  return el.closest(".rm-block__input")
}

export const getActiveBlockUid = () => {
  const roamInput = getActiveRoamInputElement()
  return roamInput.id.slice(-9)
}

export const getActiveNotebookId = () => getUidOfClosestBlockReferencing(getActiveBlockUid(), Settings.notebookMaker)

export const removeBackticks = (str: string, language: string = "javascript") => {
  var ttt = "``" + "`";
  return str.replace(ttt + language, "").replace(ttt, "");
}

export const getActiveCodeBlockContent = () => {
  const el = document.activeElement.closest(".cm-content") as HTMLElement
  return el.innerText
}

/* ====== TREE PARSERS ====== */
const invertTree = (block, topUid) => {
  var attachParent = (oldTopBlock) => {
    var newTopBlock = oldTopBlock._children[0];
    newTopBlock.child = oldTopBlock;
    if (newTopBlock.uid === topUid) return newTopBlock;
    return attachParent(newTopBlock)
  }
  var invertedTree = attachParent(block);

  return invertedTree;
}

const mergeTreesByUid = (topBlocks) => {
  var latchOnto = (tree, topBlock) => {
    var order = parseInt(topBlock.order) || 0;
    if (!tree[order]) {
      tree[order] = topBlock;
      if (topBlock.child) {
        tree[order].children = []
        tree[order].children[topBlock.child.order] = topBlock.child
      }
    } if (topBlock.child && topBlock.uid === tree[order].uid) {
      tree[order].children = latchOnto(tree[order].children || [], topBlock.child)
    }

    return tree;
  }

  var finalTree = [];
  topBlocks.forEach(topBlock => {
    finalTree = latchOnto(finalTree, topBlock)
  });
  return finalTree;
}

const flatten = (tree) => {
  var finalArray = []
  var stepIn = (node) => {
    finalArray.push(node)
    if (node.children && node.children.length !== 0)
      node.children.forEach(child => {
        stepIn(child);
      });
  }
  stepIn(tree);
  return finalArray;
}

export const processCodeBlocks = (codeblocks, uid, language: string = "javascript") => {
  var trees = codeblocks.map(codeblock => invertTree(codeblock[0], uid));
  var tree = mergeTreesByUid(trees);
  console.log("tree", tree)
  var cells = flatten(tree.filter(tr => tr)[0]);
  cells = cells.filter(cell => cell.string && cell.string.startsWith("```" + language))
    .map(cell => {
      return {
        uid: cell.uid,
        string: removeBackticks(cell.string)
      }
    })
  console.log(`Found ${cells.length} cells in the notebook`)
  return cells;
}
