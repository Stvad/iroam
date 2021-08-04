interface IRoamSettings {
    notebookMaker?: string
}

declare global {
    interface Window {
        iroamSettings: IRoamSettings
    }
}


const DefaultSettings: IRoamSettings = {
    notebookMaker: "iroam/notebook"
}

export const Settings = {...DefaultSettings, ...window.iroamSettings}
