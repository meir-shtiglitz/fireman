import "../css/viewGalery.scss";
import { actDeleteMedia, actPublishMedia, actTopImg } from "../redux/actions/media";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as liteLike } from '@fortawesome/free-regular-svg-icons';

import { useDispatch } from "react-redux";

const ViewGalery = ({ images, currentImage }) => {
    const { isAdmin } = useSelector(state => state.User);
    const dispatch = useDispatch();

    const deleteImg = (id) => {
        console.log("id from delete func", id)
        dispatch(actDeleteMedia(id));
    }

    const hideImg = (id, status) => {
        console.log("status from hide func", status)
        dispatch(actPublishMedia(id, !status));
    }

    const topImg = (id, status) => {
        console.log("status from top func", status)
        dispatch(actTopImg(id, !status));
    }

    function randomColSize(index){
        var row = 0;
        return () => {
            if (row === 12) row = 0;
            let random = Math.ceil(Math.random() * 4) + 1;
            if ((row + random) > 12) random = 12 - row;
            row = row + random;
            return random;
        }
    }
    let setCol = randomColSize();

    return (
        <div className="view-galery row">
            {images?.filter(p => p.publish || isAdmin).map((p, i) =>
                <div key={p._id} className={`wrap-img col-sm-${isAdmin ? 3 : setCol(i)}`}>
                    <img onClick={() => currentImage(i)} src={p.url} alt="image" />
                    {isAdmin && <div className="img-controls">
                        <button onClick={() => deleteImg(p._id)} className="btn btn-danger">X</button>
                        <button onClick={() => hideImg(p._id, p.publish)} className="btn btn-dark">{p.publish ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
                        <button onClick={() => topImg(p._id, p.top)} className="btn btn-outline-success">{p.top ? <FontAwesomeIcon icon={faThumbsUp} /> : <FontAwesomeIcon icon={liteLike} />}</button>
                    </div>}
                </div>
            )}
        </div>
    )
}
export default ViewGalery;