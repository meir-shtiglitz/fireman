import { useEffect, useState } from "react";
import { actDeleteMedia, actGetMedia, actPublishMedia } from "../redux/actions/media";
import { useDispatch, useSelector } from "react-redux";
import UseCloseOnClick from "../hooks/closeOnClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import "../css/videos.scss";

const Videos = () => {
    const dispatch = useDispatch();
    const { media } = useSelector(state => state.Media);
    const videos = media.filter(m => m.type === 'video');
    const [playVideo, setPlayVideo] = useState();
    const { refNotClose } = UseCloseOnClick(() => playVideo && setPlayVideo(null));
    const { isAdmin } = useSelector(state => state.User)

    useEffect(() => {
        if (videos.length < 1) dispatch( actGetMedia() );
    }, []);

    const deleteVideo = (id) => {
        console.log("id from delete func", id)
        dispatch( actDeleteMedia(id) );
    }

    const hideVideo = (id, status) => {
        console.log("status from delete func", status)
        dispatch( actPublishMedia(id, !status) );
    }


    const playMe = (e, video) => {
        e.preventDefault();
        setPlayVideo(video.url);
        console.log("video", video);
        console.log("play video", playVideo);
    }

    return (
        <>
            {videos.length > 0 && <div className="videos">
                {console.log('videos from component', videos)}
                {playVideo && <div className="overlay">
                    <div ref={refNotClose} className="in-overlay">
                        <video className="main-video" autoPlay controlsList="nodownload" preload="metadata" src={playVideo + '#t=2'} controls>
                            video is not supported
                        </video>
                    </div>
                </div>}

                <div className="video-list row align-center">
                    {videos.filter(v => v.publish || isAdmin).map((v, i) =>
                        <div key={v._id} className="video-item col-sm-4 mt-5">
                            <FontAwesomeIcon className="play-icon" icon={faPlayCircle} />
                            <video onClick={(e) => playMe(e, v)} src={v.url + '#t=2'}>
                                video is not supported
                            </video>
                            {isAdmin && <div className="video-controls">
                                <button onClick={() => deleteVideo(v._id)} className="btn btn-danger">X</button>
                                <button onClick={() => hideVideo(v._id, v.publish)} className="btn btn-dark">{v.publish ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
                            </div>}
                        </div>)
                    }
                </div>
            </div>}
        </>
    )
}

export default Videos;