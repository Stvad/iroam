import {handleKeyPress} from "./keyboard"
import * as roamClient from "roam-client"
import {Attribute, Block, Page} from "roam-client"
import * as RoamDate from "roam-client";

import { html } from "htl"

import './execution-style.css'
import {observe} from "./observable"

console.log("Loading iRoam")

document.addEventListener("keydown", handleKeyPress)

// Exposing all the utilities to be more easily accessible in the notebook.
window.roamClient = roamClient
window.block = Block.fromUid
window.attribute = (str) => Attribute.fromName(str)
window.observe = observe
window.page = Page.fromName

interface Type {
    marker: any,
    fields: Field[]
}

interface Field {
    key: string
    locators?: Array<string[]>
    type: string
}

window.typed = {
    personType: {
        marker: {
            key: "isa",
            value: ["person"],
        },
        fields: [
            {
                key: "location",
                locators: [
                    //["location"], // implicitly from key?
                    ["metadata", "location"], // can also be "metadata::location"
                ],
                type: "location",
                //on auto-fill - suggest most common values for the given property
                // todo on based on locations referenced alongside the person

            },
            {
                key: "How We Met",
                locators: [
                    ["metadata", "How We Met"],
                ],
            },
            {
                key: "connection",
                type: "personal connection|public figure",
                //can be more granular on personal things
            },
        ],
    } as Type,

    findByType(type) {
        //todo all markers
        const blocks = Attribute.fromName(type.marker.key)
            .findBlocksWithValue(type.marker.value[0])
        const pages = blocks.map(it => it.containerPage)
        return pages.map(it => {
            const components =
                type.fields.map(field => [field.key, this.getFieldValue(it, field)])
            return Object.fromEntries([["id", it.text], ...components])
        })
    },

    getFieldValue(page: Page, field: Field) {
        for (const key of [[field.key], ...(field.locators || [])]) {
            const val = page.childAtPath(key)
            if (val) {
                const attrValues = val.listAttributeValues()
                return attrValues.length ? attrValues : undefined
            }
        }
        return null
    },

    setFieldValue(page: Page, field: Field, value: string) {
        page.setAttribute(field.key, value)
        // page[field.key + "::"]
    },

    renderProperty(item, property:string, type: Type) {
        const suggestionButton = (value: string) =>
            html`<button onclick=${() => this.setFieldValue(item, getField(type, property), value)}>${value}</button>`


        const suggestions = () => {
            const suggestionValues = Attribute.fromName(property).getValuesByCount().slice(0,5)
            return suggestionValues.map(it => suggestionButton(it[0]))
        }

        const value = item[property] ? item[property] : suggestions()
        return html`<div>
        <h4>${property}</h4>
        <p>${value}</p>
        </div>`
    },
}


const getField = (type: Type, key: string) =>
    type.fields.find(it => it.key == key)
