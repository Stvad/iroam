import {getActiveBlockUid, getActiveCodeBlockContent as getActiveCodeBlockContent, getActiveNotebookId} from "./helpers"
import {getAllCodeBlocksNestedUnder, writeToNestedBlock} from "./api"
import {CellRunner} from "./observable"

class CellRunnerManager {
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
    console.log("Running notebook with uid:" + notebookUid)

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

/**
 * Runs only the active cell
 */
export const runActiveBlockAndWriteToNext = async () => {
    const activeUid = getActiveBlockUid()
    const notebookId = await getActiveNotebookId()
    console.log(`Running cell ${activeUid} from ${notebookId} notebook`)
    const code = getActiveCodeBlockContent()

    await runnerManager.get(notebookId).run(
        code,
        activeUid,
        (out: string) => writeToNestedBlock(activeUid, out))
}

export const runActiveNotebook = async () => {
    return runAllBlocksBelowUidAndWrite(await getActiveNotebookId())
}
