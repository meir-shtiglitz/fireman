import { useParams } from "react-router-dom"

const AproveVideo = () => {
    const {src, ID} = useParams();
    return(
        <div className="aprove-video">
            <video preload="metadata" controls width={400} height={300}>
                <source src={src+'#t=2'} type="video/mp4"  />
                video load filed</video>
            <button className="btn btn-success">אשר סרטון</button>
        </div>
    )
}
export default AproveVideo;