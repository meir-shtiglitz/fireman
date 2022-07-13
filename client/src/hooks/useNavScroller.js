const { useState, useEffect } = require("react");
const { useLocation } = require("react-router");

export const UseNavScroller = () => {
    const [loc, setLoc] = useState();

    var location = useLocation();
    location = {
        pathname:"/",
        hash: loc
    }
    useEffect(()=> {
        if (location.hash) {
            setTimeout(()=> {
                let elem = document.getElementById(location.hash.slice(1))
                if (elem) {
                    setTimeout(()=> elem.scrollIntoView({behavior: "smooth"}),100)
                } else{
                    window.scrollTo({top:0,left:0, behavior: "smooth"});
                }
            },300)
        } else {
            window.scrollTo({top:0,left:0, behavior: "smooth"})
        }
        setLoc('/');
    }, [location])

    const toScroll = (e) => {
        setLoc(`#${e.target.href.split('#')[1]}`);
    }

    return {toScroll}

}