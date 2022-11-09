import axios from "axios";

export const sendContactMail = (contactForm) => {
    console.log('contact from api',contactForm)
    axios.post(`${process.env.REACT_APP_API_URL}/contact`, contactForm, {
        headers:{ "Content-Type": "application/json"
    }}
    )
}