import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";

const Stars = ({ starsNum, editMode, func }) => {

    const [num, setNum] = useState(starsNum);
    useEffect(() => {
        setNum(starsNum)
    }, [starsNum])

    const stars = () => {
        let str = [];
        for (let s = 1; s <= num; s++) {
            str.push(<FontAwesomeIcon key={s} onClick={() => updateNum(s)} icon={faStar} />);
        }
        if (num % 1) str.push(<FontAwesomeIcon key={99} icon={faStarHalfAlt} />)
        for (let e = str.length + 1; e < 6; e++) {
            str.push(<FontAwesomeIcon onClick={() => updateNum(e)} key={e} icon={farStar} />);
        }
        return str;
    }

    const updateNum = (num) => {
        if (editMode) {
            setNum(num)
            func && func(num);
        }
    }

    return (
        <div style={{}} className="stars">{stars()}</div>
    )
}
export default Stars;