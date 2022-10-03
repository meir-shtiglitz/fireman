import { useState } from "react"
import { sendContactMail } from "../api/contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from '@fortawesome/free-regular-svg-icons'
import "../css/contact.scss"
import Rabbit from "./rabbit";
import Swal from "sweetalert2";

const Contact = () => {

    const [fields, setFields] = useState({
        mailUser: '',
        msg: ''
    })

    const inputer = (e) => {
        e.preventDefault();
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

    const sendMail = (e) => {
        e.preventDefault();
        console.log(fields);
        sendContactMail(fields);
        Swal.fire({
            icon: "success",
            title: "ההודעה נשלחה בהצלחה",
            confirmButtonText: "בחזרה לאתר"
        }).then((res)=> console.log(res))
        setFields({ mailUser: '', msg: ''})
    }

    return (
        <div id="contact" className="row p-0 bs-none container m-auto">
                <form className="col-sm-4" onSubmit={sendMail}>
                    <div className="form-group">
                        <label htmlFor="email">כתובת מייל:</label>
                        <input onInput={inputer} id="email" value={fields.mailUser} name="mailUser" type="email" className="form-control" />
                    </div>
                    <div className="form-group second">
                        <label htmlFor="email">תוכן ההודעה:</label>
                        <textarea onInput={inputer} id="message" value={fields.msg} name="msg" cols={30} rows={10} type="text" className="form-control"></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">שלח</button>
                </form>
                <div className="contact-head col-sm-3">
                    <FontAwesomeIcon className="contact-title-border" icon={faComment} />
                    <h1 className="contact-title">צור קשר</h1>
                </div>
                <div className="home-rabbit col-sm-1">
                    <Rabbit />
                </div>
        </div>
    )
}
export default Contact;