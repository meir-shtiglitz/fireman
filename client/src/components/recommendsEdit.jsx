import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getRecommendApi, sendRecommendApi } from "../api/recommend";
import Stars from "./stars";
import "../css/recommendsEdit.scss";
import InputFiles from "./inputFiles";
import { useDispatch, useSelector } from "react-redux";
import { actGetRecommends, actSendRecommend } from "../redux/actions/recommends";
import Swal from 'sweetalert2'
import { UseKeyboardClick } from "../hooks/useKeyboardClick";

const { useState } = require("react");

const RecommendEdit = () => {
    const keyboardPress = UseKeyboardClick('Enter', sendRecommend)
    const navigate = useNavigate();
    const { recID } = useParams();
    const dispatch = useDispatch();
    const { isAdmin } = useSelector(state => state.User);
    const { recommends } = useSelector(state => state.Recommends);
    const [images, setImages] = useState();
    const initialRecommend = {
        title: '',
        description: '',
        author: '',
        location: '',
        stars: 0,
        hide: false,
        public: false,
        filesToDelete:[]
    }
    const [fields, setFields] = useState(initialRecommend)

    useEffect(async () => {
        console.log('recID', recID);
        console.log('isAdmin', isAdmin);
        if (isAdmin) {
            if (recommends.length < 1) await dispatch(actGetRecommends());
            console.log('recommend from effect', { ...[...recommends]?.filter(r => r._id == recID)[0] })
            setFields({ ...initialRecommend, ...[...recommends]?.filter(r => r._id == recID)[0] });
        } else if (recID) {
            const rec = await getRecommendApi(recID);
            console.log('rec', rec)
            setFields({ ...initialRecommend, ...rec[0], public: false })
        } else {
            navigate('/');
        }
    }, [recID, recommends, isAdmin])

    const getMedia = () => (
        fields.media && fields.media.map((m, i) => <div key={m._id} className="img-item">
            {m.type === 'image' ? <img width={100} src={m.url} /> : <video controls width={150} height={100} src={m.url}>סרטון לא נתמך</video>}
            <button type="button" onClick={() => removeMedia(m._id)} className="btn btn-danger">X</button></div>
        )
    )

    const removeMedia = (id) => {
        const newMedia = fields?.media?.filter(m => m._id !== id);
        setFields({ ...fields, filesToDelete:[...fields.filesToDelete, id], media: newMedia })
    }

    const inputer = (e) => {
        const newVal = e.target.name === 'hide' ? !fields.hide : e.target.value;
        setFields({ ...fields, [e.target.name]: newVal });
    }

    const setStars = (num) => {
        setFields({ ...fields, stars: num });
    }

    const changePublic = (e) => {
        const newPublic = e.target.checked ? true : false;
        setFields({ ...fields, public: newPublic })
    }

    function sendRecommend(e){
        e && e.preventDefault();
        console.log(fields);
        console.log("images from component", images);
        // sendRecommendApi(fields, images);
        dispatch(actSendRecommend(fields, images));
        if (isAdmin) return navigate('/recommends');
        Swal.fire({
            icon: "success",
            title: "תודה רבה על המשוב",
            titleText: "המשוב נשלח לאישור בטרם יפורסם",
            confirmButtonText: "בחזרה לאתר"
        }).then(()=> navigate('/'))
    }

    return (
        <div id="recommend-edit">
            <form className="row col-sm-6 m-auto mt-3 p-3" onSubmit={sendRecommend}>
                <h1 className="text-center">משוב</h1>
                <div className="form-group col-sm-12">
                    <label htmlFor="title">כותרת:</label>
                    <input onInput={inputer} id="title" name="title" value={fields.title} type="text" className="form-control" />
                </div>
                <div className="form-group col-sm-12">
                    <label htmlFor="description">תיאור:</label>
                    <textarea onInput={inputer} id="description" name="description" rows={5} cols={30} value={fields.description} type="text" className="form-control"></textarea>
                </div>
                <div className="form-group col-6">
                    <label htmlFor="stars">דירוג:</label>
                    <Stars starsNum={fields.stars} editMode={true} func={setStars} />
                </div>
                <div className="form-group col-6">
                    <label htmlFor="author">שם:</label>
                    <input onInput={inputer} id="author" name="author" value={fields.author} type="text" className="form-control" />
                    <label htmlFor="hide">הסתר את שמי באתר: </label>
                    <input onChange={inputer} type="checkbox" name="hide" id="hide" />

                </div>
                <div className="form-group col-6">
                    <label htmlFor="location">מקום ההופעה:</label>
                    <input onInput={inputer} id="location" name="location" value={fields.location} type="text" className="form-control" />
                </div>
                <div className="form-group col-sm-6">
                    <label>תמונות:</label>
                    <div className="current-images">{getMedia()}</div>
                </div>
                <div className="form-group col-6 mb-5">
                    {images && <p>שימו לב צירוף מדיה מהווה אישור לפירסומה באתר</p>}
                    <InputFiles change={setImages} />
                </div>
                {isAdmin && <div className="form-group col-6">
                    <label htmlFor="public">אישור פירסום: </label>
                    <input onChange={changePublic} type="checkbox" name="public" id="public" />
                </div>}
                <button className="btn btn-primary btn-main">שלח</button>
            </form>
        </div>
    )
}

export default RecommendEdit;