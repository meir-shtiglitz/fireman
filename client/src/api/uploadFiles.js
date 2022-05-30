import axios from "axios";

export const apiUploadFiles = async(files) => {
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
        fd.append(`files`, files[i])
    };
    console.log("fd from api upload files", fd);
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/media/upload`, fd, {
        headers: { 'content-type': 'multipart/form-data' }
    })
    console.log("res from api upload files", res);
}