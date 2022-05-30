import { useState } from "react"
import { sendContactMail } from "../api/contact";

const Contact = () => {

    const [fields, setFields] = useState({
        mailUser:'',
        msg:''
    })

    const inputer = (e) => {
        e.preventDefault();
        setFields({...fields, [e.target.name]: e.target.value});
    }

    const sendMail = (e) => {
        e.preventDefault();
        console.log(fields);
        sendContactMail(fields);
    }

    return(
        <div id="contact" className="row container m-auto">
            <form className="col-sm-4 m-auto" onSubmit={sendMail}>
                <div className="form-group">
                    <label htmlFor="email">כתובת מייל:</label>
                    <input onInput={inputer} id="email" value={fields.mailUser} name="mailUser" type="email" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">תוכן ההודעה:</label>
                    <textarea onInput={inputer} id="message" value={fields.msg} name="msg" cols={30} rows={10} type="text" className="form-control"></textarea>
                </div>
                <button type="submit" className="btn btn-success">שלח</button>
            </form>
        </div>
    )
}
export default Contact;