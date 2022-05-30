import { useSelector } from "react-redux";
import "../css/homeHerro.scss";
import Carousel from "./carousel";
import text from "../assets/text.json"

const HomeHerro = () => {
    const { media } = useSelector(state => state.Media);
    const topImages = media.filter(m => m.top) || [];

    return (
        <div className="herro">
            <div className="herro-carousel">
                <div className="text">
                    <div>
                        <h1>{text.herro.title}</h1>
                        <h2>{text.herro.subtitle}</h2>
                    </div>
                </div>
                {topImages.length && <Carousel arrows={false} autoPlay>
                    {topImages.map((img, i) => <div className="herro-carousel-item" key={img._id}><img src={img.url} alt="herro image" /></div>)}
                </Carousel>}
            </div>
        </div>
    )
}
export default HomeHerro;