import {getActiveBlockUid, getActiveCodeBlockContent as getActiveCodeBlockContent} from "./helpers"
import {getAllCodeBlocksNestedUnder, getUidOfClosestBlockReferencing, writeToNestedBlock} from "./api"
import {CellRunner} from "./observable"
import {Settings} from "./settings"


class CellRunnerManager {
    default = new CellRunner()
    readonly cellRunners = new Map<string, CellRunner>()

    get(id: string) {
        if (!this.cellRunners.has(id)) {
            this.cellRunners.set(id, new CellRunner())
        }

        return this.cellRunners.get(id)
    }
}

const runnerManager = new CellRunnerManager()

const runAllBlocksBelowUidAndWrite = async (notebookUid) => {
    const cells = await getAllCodeBlocksNestedUnder(notebookUid)
    const activeUid = getActiveBlockUid()

    const runner = runnerManager.get(notebookUid)

    for (const cell of cells) {
        if (cell.uid === activeUid) cell.string = getActiveCodeBlockContent()

        await runner.run(
            cell.string,
            cell.uid,
            (out: string) => writeToNestedBlock(cell.uid, out))
    }
}

const cellRunner = new CellRunner()
/**
 * Runs only the active cell
 */
export const runActiveBlockAndWriteToNext = async () => {
    const activeUid = getActiveBlockUid()
    const code = getActiveCodeBlockContent()
    await cellRunner.run(
        code,
        activeUid,
        (out: string) => writeToNestedBlock(activeUid, out))
}

/**
 * Runs the whole notebook
 */
export const runActiveNotebook = async () => {
    const uid = getActiveBlockUid()
    const notebookUid = await getUidOfClosestBlockReferencing(uid, Settings.notebookMaker)
    console.log("Notebook Block uid:" + notebookUid)
    runAllBlocksBelowUidAndWrite(notebookUid)
}
