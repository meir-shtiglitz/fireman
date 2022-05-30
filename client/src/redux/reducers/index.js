import { combineReducers } from "redux";
import { Loader } from "./loader";
import { Recommends } from "./recommends";
import { User } from "./user";
import { Media } from "./media";

export default combineReducers({
        Loader,
        Recommends,
        User,
        Media
    })
