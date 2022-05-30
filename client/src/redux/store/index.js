import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducers from "../reducers/index"

const store = createStore(rootReducers, composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;