const initialState = {
    videos: []
}
export const Videos = (state=initialState, {type,payload}) => {
    if (type === 'LOAD_VIDEOS' || type === 'SET_VIDEOS'){
        return {...state, ...payload}
    } else{
        return state
    }
}