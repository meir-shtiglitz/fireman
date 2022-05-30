import axios from "axios";
import store from "../store";

export const actLoadVideos = () => async dispatch => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/videos`).catch(error => error);
    console.log("res from action load video", res);
    if (!res.data) return;
    return dispatch({type: 'LOAD_VIDEOS', payload:{videos:res.data}})
}

export const actDeleteVideo = (id) => async dispatch => {
    console.log("id from action delete video",id);

    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/videos/delete/${id}`).catch(err => err.response.data)
    console.log("res from action delete video", res);
    const state = store.getState();
    console.log("state from publish action",state);
    const newVideos = state.Videos.videos.filter(vid => vid.ID !== id);
    console.log("new videos", newVideos)
    return dispatch({type: "SET_VIDEOS", payload:{videos:newVideos}})
}

export const actPublishVideo = (id,status) => async dispatch => {
    console.log("greeth from action publish video",id+':'+status);

    const res = await axios.get(`${process.env.REACT_APP_API_URL}/videos/publish/${id}/${status}`).catch(err => err.response.data)
    console.log("res from action videos", res);
    const state = store.getState();
    console.log("state from publish action",state);
    const newVideos = state.Videos.videos.map(vid => vid.ID === id ? {...vid, publish: status} : vid);
    console.log("new videos", newVideos)
    return dispatch({type: "SET_VIDEOS", payload:{videos:newVideos}})
}
