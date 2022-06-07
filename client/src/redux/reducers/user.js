const initialState = {
    user: {},
    token: null,
    isAdmin: null
}
export const User = (state = initialState, {type, payload}) => {
    switch(type){
        case ('AUTH_SUCCESS'):
            return{...state, ...payload}

        case('AUTH_FAIL'):
        case('LOG_OUT'):
        return {...state, ...initialState, user: null, isAdmin: false};

        default:
            return state
    }
}