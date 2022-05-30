import { useDispatch } from "react-redux";
import { useState } from "react/cjs/react.development";
import { actLogin, actRegister } from "../redux/actions/user";

const Auth = ({regMode}) => {

    const [fields, setFields] = useState({
        email: '',
        password:''
    })

    const [registerMode, setRegisterMode] = useState(regMode)

    const dispatch = useDispatch();

    const inputer = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

    const submitAuth = (e) => {
        e.preventDefault();
        console.log(fields);
        registerMode ? dispatch(actRegister(fields)) : dispatch(actLogin(fields));
    }

    const changeMode = () => {
        setRegisterMode(prevMode => !prevMode);
    }

    return (
        <div id="auth">
            <h1>{registerMode ? 'הרשמה' : 'כניסה'}</h1>
            <form className="row col-sm-6 m-auto" onSubmit={submitAuth}>
                <div className="form-group col-sm-12">
                    <label htmlFor="email">כתובת מייל:</label>
                    <input onInput={inputer} id="email" name="email" value={fields.email} type="email" className="form-control" />
                </div>
                <div className="form-group col-sm-12">
                    <label htmlFor="password">סיסמה:</label>
                    <input onInput={inputer} id="password" name="password" value={fields.password} type="text" className="form-control" />
                </div>
                <button className="btn btn-primary">{registerMode ? 'הרשמה' : 'כניסה'}</button>
                <h4 onClick={changeMode}>{registerMode ? 'יש לי חשבון' : 'להרשמה'}</h4>
            </form>
            </div>
    )
}
export default Auth;