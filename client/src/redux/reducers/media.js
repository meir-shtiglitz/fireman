const initialState = {
    media: []
}

export const Media = (state=initialState, {type, payload}) => {
    return {...state, ...payload}
}