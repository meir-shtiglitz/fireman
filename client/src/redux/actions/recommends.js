import axios from "axios";
import { getRecommendApi } from "../../api/recommend";
import store from "../store";

// get all recommends
export const actGetRecommends = (data) => async dispatch => {
        const recommends = await getRecommendApi();
        console.log("recommends from action creator", recommends);
        const payload = {
            recommends,
        }
        dispatch({ type: "LOAD_RECOMMENDS", payload });
}

export const actSendRecommend = (fields, images) => async dispatch => {
    console.log("fields from action send Recommend", fields);
    console.log("images from action send Recommend", images);
    const fd = new FormData();
    for(let key in fields){
        fd.append(key, fields[key]);
    }
    if(images){
        for(let i = 0; i < images.length; i++){
            fd.append(`files`, images[i])
        };
    }
    console.log("fd from actSendRecommend send Recommend", fd);
    axios.put(`${process.env.REACT_APP_API_URL}/recommend`, fd,{
        headers:{ 'content-type': 'multipart/form-data'
    }})

    const state = store.getState();
    const recommends = state.Recommends.recommends.map(r => (r._id === fields._id) ? {...r,...fields} : r);
    return dispatch ( {type: 'SET_RECOMMENDS', payload:{recommends}} )
}