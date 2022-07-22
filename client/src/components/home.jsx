import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actGetMedia } from "../redux/actions/media";
import About from "./about";
import HomeHerro from "./home-herro";
import Recommends from "./recommends";
import "../css/home.scss";
import Contact from "./contact";
import Rabbit from "./rabbit";

const Home = () => {
    const dispatch = useDispatch();
    const { media } = useSelector(state => state.Media);
    useEffect(() => {
        if ( !media.length ) dispatch( actGetMedia() );
    },[])
    return (
        <div className="home">
            <HomeHerro />
            <div className="row">
                <div className="home-recommends col-sm-6">
                    <Recommends carouselMode={true} />
                </div>
            </div>
            <div className="row">
                <div className="home-about col-sm-12">
                    <About />
                </div>
            </div>
            <div className="row">
                <div className="home-contact col-sm-12 row">
                    <div className="col-sm-6">
                        <Contact />
                    </div>
                    <div className="home-rabbit col-sm-6">
                        <Rabbit />
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Home;
