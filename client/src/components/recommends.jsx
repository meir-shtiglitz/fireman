import { useEffect, useState } from "react";
import "../css/carousel.scss";
import Carousel from "./carousel";
import Recommend from "./recommend";
import { actGetRecommends } from "../redux/actions/recommends";
import { useSelector, useDispatch } from "react-redux";

const Recommends = ({ carouselMode }) => {

    const dispatch = useDispatch();
    const {user, isAdmin} = useSelector(state => state.User);
    const { recommends: recs } = useSelector(state => state.Recommends);

    const [allItems, setAllItems] = useState(recs);
    const [publishItems, setPublishItems] = useState();

    useEffect(async () => {
        if (!recs || recs.length < 1) {
            dispatch(actGetRecommends());
        } else {
            if (!recs || recs.length < 1) return;
            setAllItems(recs);
            setPublishItems(recs.filter(item => item.public));
        }

    }, [recs])

    function getLocationClass(index){
        if ( index > 2 ) index = Math.ceil( Math.random() * 4 )
        if ( !(index % 3) ) return 'right';
        if ( !(index % 4) ) return 'middle fourth';
        if ( (index % 2) && (index % 5) ) return 'middle';
    }

    return (
        <>
        {console.log("user from return in component", user)}
        {console.log("recommends from return in component", recs)}
        {console.log("isAdmin from return in component", isAdmin)}
            <div className="recommends col-12">
                {allItems && publishItems && carouselMode &&
                    <Carousel autoPlay>
                        {publishItems.map((pi, i) => <div key={pi._id} className={`recommend col-sm-5 ${!(i % 2) && 'right'}`}><Recommend item={pi} /></div>)}
                    </Carousel>
                }
                {allItems && publishItems && !carouselMode &&
                    (isAdmin ? allItems : publishItems).map((item, index) => <div key={item._id} className={`recommend col-sm-4 ${getLocationClass(index)}`}><Recommend admin={isAdmin} item={item} /></div>)
                }
            </div>
        </>
    )
}
export default Recommends;