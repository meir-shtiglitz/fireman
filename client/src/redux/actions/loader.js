// control loader
export const actLoad = () => {
    console.log('start loading')
    return { type: "LOAD" }
}

export const actUnload = () => {
    console.log('stop loading')
    return { type: "UNLOAD" }
}