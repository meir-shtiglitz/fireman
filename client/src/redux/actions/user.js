import axios from "axios";
import { actLoad, actUnload } from "./loader";

const toStore = (res, dispatch) => {
    if(res.data){
        const payload = {
            user: res.data.user,
            token: res.data.token,
            isAdmin: res.data.user.role > 3
        }
        localStorage.setItem('token', res.data.token);
        return dispatch({type: 'AUTH_SUCCESS', payload})
    }
    return dispatch({type: 'AUTHE_FAIL'})
}
export const actLogin = data => async dispatch => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, data,{
        headers:{ "Content-Type": "application/json"
    }}).catch(err => err.response.data)
    console.log("res from action", res);
    toStore(res, dispatch);
}

export const actRegister = data => async dispatch => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, data,{
        headers:{ "Content-Type": "application/json"
    }}).catch(err => err.response.data);
    console.log("res from action", res);
    toStore(res,dispatch)
}

export const actLoginByToken = () => async dispatch => {
    const token = localStorage.getItem('token');
    console.log("token from action",token)
    if(!token) return dispatch( actLogout() );
    dispatch ( actLoad() )
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login/token/${token}`)
    .catch(err => err.response.data);
    dispatch ( actUnload() );
    console.log("res from action", res);
    toStore(res,dispatch)
}

export const actLogout = () => {
    localStorage.removeItem('token');
    return {type: 'LOG_OUT', payload: {user: null, token: null, isAdmin: false}}
}