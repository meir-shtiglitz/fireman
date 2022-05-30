const initialState = {
    recommends: []
};

export const Recommends = (state = initialState, {type,payload}) => {
    console.log("paylpad from reducer",payload)
    console.log("state from reducer",state)
    switch(type){
        case ('LOAD_RECOMMENDS'):
        case ('SET_RECOMMENDS'):
           return {...state, ...payload};

        default:
             return state

    }
}