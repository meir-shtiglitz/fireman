import "../css/fire.scss";

const Fire = () => {
    const loop = () => {
        let parts = 50;
        var particles = [];
        while(parts--){
            particles.push(<div className="particle"></div>);
        }
        return particles;
    }
    return (
        <>
            <div className="fire">
                {loop()}
            </div>
        </>
    )
}
export default Fire;