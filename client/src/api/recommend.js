import axios from "axios";

export const getRecommendApi = async(id) => {
    console.log('from getRecommendApi',id);
    // const tokenID = id ? id : null;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/recommend`, {params:{id}});
    console.log('res from getRecommendApi',res);
    return res.data;
}

export const sendRecommendApi = (fields, images) => {
    console.log("fields from api send Recommend", fields);
    console.log("images from api send Recommend", images);
    const fd = new FormData();
    for(let key in fields){
        fd.append(key, fields[key])
    }
    if(images){
        for(let i = 0; i < images.length; i++){
            fd.append(`files`, images[i])
        };
    }
    console.log("fd from api send Recommend", fd);
    axios.put(`${process.env.REACT_APP_API_URL}/recommend`, fd,{
        headers:{ 'content-type': 'multipart/form-data'
    }})
}


export const newRecommendApi = async() => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommend`);
    console.log('res',res);
    return res.data._id;
}

