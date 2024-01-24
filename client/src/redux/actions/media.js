import axios from "axios";
import { Videos } from "../reducers/videos";
import store from "../store";


export const actGetMedia = () => async dispatch => {
    console.log("greeth from action media");

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/media`).catch(err => err.response.data)
    console.log("res from action media", res);
    return dispatch({type: "SET_MEDIA", payload:{media: res.data}})
}

export const actDeleteMedia = (id) => async dispatch => {
    console.log("id from action delete media",id);

    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/media/delete/${id}`).catch(err => err.response.data)
    console.log("res from action delete media", res);
    const state = store.getState();
    console.log("state from publish action",state);
    const newMedia = state.Media?.media?.filter(m => m._id !== id);
    console.log("new media", newMedia)
    return dispatch({type: "SET_MEDIA", payload:{media:newMedia}})
}

export const actPublishMedia = (id,status) => async dispatch => {
    console.log("greeth from action publish media",id+':'+status);

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/media/publish/${id}/${status}`).catch(err => err.response.data)
    console.log("res from action media", res);
    const state = store.getState();
    console.log("state from publish action",state);
    const newMedia = state.Media.media.map(m => m._id === id ? {...m, publish: status} : m);
    console.log("newMedia", newMedia)
    return dispatch({type: "SET_MEDIA", payload:{media:newMedia}})
}

export const actTopImg = (id,status) => async dispatch => {
    console.log("greeth from action top images - id:",id+' status:'+status);

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/media/top/${id}/${status}`).catch(err => err.response.data)
    console.log("res from action images", res);
    const state = store.getState();
    console.log("state from top action",state);
    const newMedia = state.Media.media.map(m => m._id === id ? {...m, top: status} : m);
    console.log("newMedia", newMedia)
    return dispatch({type: "SET_MEDIA", payload:{media:newMedia}})
}
