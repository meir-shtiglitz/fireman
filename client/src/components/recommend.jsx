import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faComments, faComment } from '@fortawesome/free-solid-svg-icons'
import Stars from "./stars";
import { Link } from "react-router-dom";
import "../css/recommends.scss";

const Recommend = ({ item, admin }) => {

    return (
        <>
            {/* <FontAwesomeIcon icon={faMessage} /> */}
            <svg className="bg-recommend" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M511.1 63.1v287.1c0 35.25-28.75 63.1-64 63.1h-144l-124.9 93.68c-7.875 5.75-19.12 .0497-19.12-9.7v-83.98h-96c-35.25 0-64-28.75-64-63.1V63.1c0-35.25 28.75-63.1 64-63.1h384C483.2 0 511.1 28.75 511.1 63.1z" /></svg>
            <FontAwesomeIcon className="bg-recommend bg-middle" icon={faComment} />
            <div className="text-recommend">
                {admin && <Link to={`/recommend/edit/${item._id}`} className="btn btn-secondary"><FontAwesomeIcon icon={faEdit} /></Link>}
                <FontAwesomeIcon icon={faComments} />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {/* <div className="stars">{stars(item.stars)}</div> */}
                <Stars starsNum={item.stars} />
                <h6>{(item.hide && !admin) ? 'השם שמור במערכת' : item.author} מ{item.location}</h6>
            </div>
        </>
    )
}
export default Recommend;