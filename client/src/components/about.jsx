import Recommends from "./recommends";
import ShowTypes from "./show-types";
import text from "../assets/text.json";
import "../css/about.scss";
import bgOldPaper from "../assets/images/old-paper.png";
import HomeHerro from "./home-herro";

const About = () => {
    return (
        <div id="about">
            {/* <h1>אודות</h1> */}
            <div className="about-text col-sm-5">
                <img src={bgOldPaper} alt="bg" />
                <p>{ text.about.description }</p>
            </div>
            <div className="about-car col-sm-5">
                <HomeHerro />
            </div>
            <div className="about-shows col-sm-12">
                <ShowTypes />
            </div>
            {/* <div className="about-recommends col-sm-12">
                <Recommends carouselMode={true} />
            </div> */}
        </div>
    )
}
export default About;