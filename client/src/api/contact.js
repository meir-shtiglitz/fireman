import axios from "axios";

export const sendContactMail = (contactForm) => {
    console.log('contact from api',contactForm)
    axios.post('http://localhost:3030/api/contact', contactForm, {
        headers:{ "Content-Type": "application/json"
    }}
    )
}