import { useState } from "react";
import { newRecommendApi } from "../api/recommend";

// just for admin
const NewRecommend = () => {
    const [recLink, setRecLink] = useState();
    const [showAlert, setShowAlert] = useState(false);

    const newRec = async (e) => {
        e.target.disabled = true;
        const recID = await newRecommendApi();
        console.log('from new rec func', recID);
        const link = `${window.location.href.split('/new')[0]}/recommend/edit/${recID}`;
        console.log('link', link);
        setRecLink(link);
        e.target.disabled = false;
        navigator.clipboard.writeText(link);
        copyLink();
    }
    
    const copyLink = (e) => {
        recLink && navigator.clipboard.writeText(recLink);
        console.log('from copyLink func', recLink);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000)
    }

    return (
        <div className="new-recommend row pt-5">
            <div className="col-sm-12 m-auto text-center">
                <button onClick={!recLink ? newRec : copyLink} className="btn">{recLink ? 'העתק קישור' : 'פתח המלצה חדשה'}</button>
                {showAlert && <div className="alert alert-secondary">הקישור הועתק</div>}
            </div>
        </div>
    )
}
export default NewRecommend;