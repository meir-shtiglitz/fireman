import { useEffect, useState } from "react";
import {Carousel as Car} from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import "../css/carousel.scss";
import { UseKeyboardClick } from "../hooks/useKeyboardClick";
import { useSwipe } from "../hooks/use-swipe";

const Carousel = ({children, autoPlay, imageDots, currentImage, arrows=true}) => {
    const rightKeyListener = UseKeyboardClick('ArrowRight', change)
    const lefttKeyListener = UseKeyboardClick('ArrowLeft', ()=> change('minus'))
    const [currentItem, setCurrentItem] = useState(currentImage || 0);
    
    const [items, setItems] = useState(children);
    const swipeFunctions = useSwipe({left:()=>change(),right: ()=> change('minus')})
    var int;
    useEffect(() => {
        autoPlay && (int = window.setInterval(() => {
            change()
        }, 3000))
        return () => {
            window.clearInterval(int);
        }
    }, [])

    // useEffect(() => {
    //    document.addEventListener('swiped-left', change);
    //     document.addEventListener('swiped-right', ()=>change('minus'));
    //     return () => {
    //         // window.clearInterval(int);
    //     }
    // }, [])

    function change(num){
        let itemsLength;
        setItems(prevItems => {
            itemsLength = prevItems.length - 1;
            if (num === 'minus') {
                setCurrentItem(currentItem => {
                    if (currentItem === 0) return itemsLength;
                    return currentItem - 1
                });
            } else {
                setCurrentItem(prevCurrentItem => {
                    // console.log('current item num from change', prevCurrentItem);
                    // console.log('items length from change', itemsLength);
                    if (prevCurrentItem >= itemsLength) return 0;
                    return prevCurrentItem + 1
                });
            }
            return prevItems
        })
    }

    const dotImgChooses = (num) => {
        setCurrentItem(num);
    }

    return (
        <>
            <div className="wrap-car col-12">
                <div className="carousel">
                    {items.map((item, index) => <div key={index} className={`car-item ${index === currentItem && 'active'}`}>{item}</div>)}
                    {arrows && <><div onClick={change} className="carousel-button next"></div>
                    <div onClick={() => change('minus')} className="carousel-button prev"></div></>}
                </div>
                {/* {imageDots && <div className="wrap-img-dots"><Car>
                    {items.map((item, index) => item)}
                </Car></div>} */}
                {/* {imageDots && <div className="wrap-img-dots"><div className="img-dots">
                    {items.map((item, index) => <div key={index} onClick={()=>dotImgChooses(index)} className={`dots-item ${index === currentItem && 'active'}`}>{item}</div>)}
                </div></div>} */}
            </div>
        </>
    )
}
export default Carousel;
// import { useEffect, useState } from "react";
// import Recommend from "./recommend";
// import "../css/carousel.css";

// const Carousel = ({publishRecs, allRecs}) => {
    
//     const [currentItem, setCurrentItem] = useState(0);

//     const [items, setItems] = useState(publishRecs);
//     var int;
//     useEffect(async () => {
//         // console.log("publishRecs",publishRecs)
//         // console.log("allRecs",allRecs)
//         int = window.setInterval(() => {
//             change()
//         }, 3000)
//         return () => {
//             window.clearInterval(int);
//         }
//     }, []
//     )

//     const change = (num) => {
//         let itemsLength;
//         setItems(prevItems => {
//             itemsLength = prevItems.length - 1;
//             if (num === 'minus') {
//                 setCurrentItem(currentItem => {
//                     if (currentItem === 0) return itemsLength;
//                     return currentItem - 1
//                 });
//             } else {
//                 setCurrentItem(prevCurrentItem => {
//                     // console.log('current item num from change', prevCurrentItem);
//                     // console.log('items length from change', itemsLength);
//                     if (prevCurrentItem >= itemsLength) return 0;
//                     return prevCurrentItem + 1
//                 });
//             }
//             return prevItems
//         })
//     }
//     return (
//         <>
//             <div className="wrap-car col-12">
//                 <div className="carousel">
//                     {items.map((item, index) => <div key={index} className={`car-item ${index === currentItem && 'active'}`}><Recommend key={{index}} item={item} /></div>)}
//                     <div onClick={change} className="carousel__button--next"></div>
//                     <div onClick={() => change('minus')} className="carousel__button--prev"></div>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default Carousel;