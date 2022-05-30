const initialState = {
    isLoading: false
}

export const Loader = (state = initialState, action) => {
    switch(action.type){
        case "LOAD":
            return {...state, isLoading: true}
        
        case "UNLOAD":
            return {...state, isLoading: false}

        default: return state
    }
}