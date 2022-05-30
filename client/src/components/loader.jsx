import "../css/fire.scss";
import '../css/loader.css';
const Loader = () => {
    const loop = () => {
        let parts = 50;
        var particles = [];
        while (parts--) {
            particles.push(<div key={parts} className="particle"></div>);
        }
        return particles;
    }
    return (
        <div className="loader">
            <div className="fire">
                {loop()}
            </div>
            <h1>טוען...</h1>
        </div>
    )
}
export default Loader;