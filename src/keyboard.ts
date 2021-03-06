import {runActiveBlockAndWriteToNext, runActiveNotebook} from "./notebook"
import {getActiveBlockUid} from "./helpers"
import {createNextCodeBlock} from "./api"

export const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.code === "Enter" && e.metaKey === true && !e.shiftKey) {
        e.stopPropagation()
        await runActiveBlockAndWriteToNext()
    } else if (e.code === "Enter" && e.altKey === true) {
        e.stopPropagation()
        await runActiveBlockAndWriteToNext()
        await createNextCodeBlock(getActiveBlockUid())
    } else if (e.code === "Enter" && e.metaKey === true && e.shiftKey === true) {
        e.stopPropagation()
        await runActiveNotebook()
    } else if (e.key === "-" && e.ctrlKey === true && e.metaKey === true) {
        console.log("iroam: Removing key listener")
        document.removeEventListener("keydown", handleKeyPress)
    }
}
