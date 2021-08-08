const {Interpreter} = require("@alex.garcia/unofficial-observablehq-compiler")
import {Inspector, Runtime} from "@observablehq/runtime"
import {Library} from "@observablehq/stdlib"
import {getHtmlElementFromUid} from "roam-client/lib/dom"
import {Block, watchTree} from "roam-client"

const observableNodeClass = "iroam-exec-result"

function createRoot(parent: Element) {
    const prevRoot = parent.querySelector(`.${observableNodeClass}`)
    if (prevRoot) {
        parent.removeChild(prevRoot)
    }

    const root = document.createElement("div")
    // root.id = rootId
    root.className = observableNodeClass

    parent.appendChild(root)
    return root
}

function getBlockContainer(id: string) {
    // todo handle invisible blocks (e.g. collapsed)
    return getHtmlElementFromUid(id)?.closest(".rm-block-main")
}

const stringify = (value: any) => JSON.stringify(value, null, 2)

export class CellRunner {
    readonly runtime = new Runtime()
    readonly mainModule = this.runtime.module()

    //todo create a cell obj and store both in it?
    readonly varsForCells = new Map<string, any>()
    readonly observers = new Map<string, any>()

    private interpreter = new Interpreter({module: this.mainModule})

    async run(code: string, id: string, writeResult: (out: string) => Promise<void>) {
        this.clearVars(id)

        this.observers.set(id, this.observers.get(id) || this.createObserver(id, writeResult))
        const observer = this.observers.get(id)

        //todo catch and process syntax errors (may be worth doing parsing separately?)
        // only do clearing of stuff if there are no syntax errors
        this.varsForCells.set(id, await this.interpreter.module(code, null, observer))
    }

    private clearVars(id: string) {
        console.log("Cleaning up vars for block ", id)
        //otherwise we get "x is redefined errors"
        //from https://observablehq.com/d/63585ffc01d6a1af
        this.varsForCells.get(id)?.forEach(vars => {
            for (const v of vars) {
                v.delete()

                // todo this is to remove "undefined" nodes
                // refers to observer created below - should define a proper type
                // also reaches into internals of Inspector which is unfortunate
                v._observer?.delegate?._node?.remove()
            }
        })
    }

    createObserver(id: string, writeResult: (out: string) => Promise<void>) {
        const displayElement = createRoot(getBlockContainer(id))
        const delegateGenerator = Inspector.into(displayElement)
        return (genInp) => {
            console.log("creating observer for", genInp)
            const delegate = delegateGenerator()
            return ({
                delegate,
                pending() {
                    console.log("pending")
                    delegate.pending()
                },
                rejected(e) {
                    console.log("rejected", e)
                    delegate.rejected(e)
                },
                fulfilled(value: any, name: any) {
                    console.log("fulfilled", value, name)

                    try {
                        delegate.fulfilled(value, name)
                    } catch (e) {
                        delegate.fulfilled(stringify(value), name)
                    }
                    writeResult(stringify(value))
                },
            })
        }
    }
}


export const observe = blockId =>
    new Library().Generators.observe(next => {

        // Yield the input’s initial value.
        next(Block.fromUid(blockId))

        return watchTree(blockId, (before, after) => next(after))
    })
