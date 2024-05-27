// import React, { useState, useCallback, useEffect, useRef } from "react";

// import Slider from "react-slick";

// import "../css/gallery.css";
// import { actGetImages } from "../redux/actions/images";
// import { useSelector, useDispatch } from "react-redux";

// const MyGallery = () => {
//   const car1 = useRef();
//   const car2 = useRef();

//   const dispatch = useDispatch()
//   const { images } = useSelector(state => state.Images);

//   useEffect(() => {
//     if (images.length < 1) dispatch(actGetImages());
//   }, [images])

//   const selectItem = (index,isFromSelect=true) => {
//     console.log('index', index);
//     let goTo = isFromSelect ? 15-index : index;
//     // console.log('goTo', goTo);
//     car1.current.slickGoTo(goTo,true);
//     // car2.current.slickGoTo(index);
//   }

//   const prev = () => {
//     car2.current.slickPrev();
//     car1.current.slickPrev();
//   }
//   const next = () => {
//     car2.current.slickNext();
//     car1.current.slickNext();
//   }

//   return (
//     <div>
//       {console.log("images", images)}
//       <div onClick={prev} className="arrow-left">{'<'}</div>
//             <Slider slidesToShow={1} ref={car1}>
//               {images.map((p, index) => <div key={index}>
//                 <img title={index} src={p.url} />
//               </div>)}
//             </Slider>
//       <div onClick={next} className="arrow-right">{'>'}</div>

//             <Slider onInit={()=>selectItem(15,true)} adaptiveHeight beforeChange={(current,next) => console.log(next)} initialSlide={0} slidesToScroll={1} slidesToShow={4} ref={car2}>
//               {images.map((p, index) => <div onClick={()=>selectItem(index,true)} key={index}>
//                 <img title={index} src={p.url} />
//               </div>)}
//             </Slider>
//           </div>
//   );
// }
// export default MyGallery;


// import React, { useState, useCallback, useEffect } from "react";

// // import Carousel from "./carousel";
// // import {Carousel} from "react-responsive-carousel";
// // import 'react-responsive-carousel/lib/styles/carousel.min.css'

// import Slider from "react-slick";

// import "../css/gallery.css";
// import UseCloseOnClick from "../hooks/closeOnClick";
// import { actGetImages } from "../redux/actions/images";
// import { useSelector, useDispatch } from "react-redux";
// import ViewGalery from "./viewGalery";

// const MyGallery = () => {
//   const [car1, setCar1] = useState();
//   const [car2, setCar2] = useState();
//   let slider1 = []
//   let slider2 = []

//   React.useEffect(() => {
//     setCar1(slider1)
//     setCar2(slider2)
//   }, [slider1, slider2])

//   const [currentImage, setCurrentImage] = useState(0);
//   const [viewerIsOpen, setViewerIsOpen] = useState(false);

//   const dispatch = useDispatch()
//   const { images } = useSelector(state => state.Images);
//   const photos = images.map((img, index) => {
//     return { ...img, src: img.url, width: (index % 2) + 3, height: (index % 2) + 3 }
//   })

//   useEffect(() => {
//     if (images.length < 1) dispatch(actGetImages());
//   }, [images])

//   const closeLightbox = () => {
//     setCurrentImage(0);
//     setViewerIsOpen(false);
//   };
//   const { refToClose } = UseCloseOnClick(closeLightbox);

//   const openLightbox = useCallback((index) => {
//     setCurrentImage(index);
//     setViewerIsOpen(true);
//   }, []);

//   var carSettings = {
//     // dots: true,
//     // infinite: true,
//     // speed: 500,
//     // autoplay: true,
//     // slidesToShow: 4,
//     // slidesToScroll: 1,
//     // focusOnSelect:true,
//     // swipeToSlide:true
//   };

//   const carouselIsChange = (i) => {
//     console.log('from change carousel', i);
//     console.log('src from change carousel', photos[i].src);
//     setCurrentImage(photos[i].src)
//   }

//   return (
//     <div>
//       {console.log("photos", photos)}
//       {1 ? (
//         <div>
//           <div>
//             <button onClick={closeLightbox} className="btn btn-danger close-btn">X</button>
//             <Slider {...carSettings} slidesToShow={1} asNavFor={car2} ref={(car1) => slider1 = car1}>
//               {photos.map((p, index) => <div key={index}>
//                 <img src={p.src} />
//               </div>)}
//             </Slider>
//             {/* <img width={300} src={currentImage} alt="" /> */}
//             <Slider afterChange={current => console.log('current', current)} focusOnSelect slidesToShow={3} asNavFor={car1} ref={(car2) => slider2 = car2}>
//               {photos.map((p, index) => <div key={index}>
//                 <img src={p.src} />
//               </div>)}
//             </Slider>
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }
// export default MyGallery;



import React, { useState, useCallback, useEffect } from "react";
import Carousel from "./carousel";
import "../css/gallery.css";
import UseCloseOnClick from "../hooks/closeOnClick";
import { actGetMedia } from "../redux/actions/media";
import { useSelector, useDispatch } from "react-redux";
import ViewGalery from "./viewGalery";
import { shuffelArray } from "../utils/data-utils";

const MyGallery = () => {
  const { User: { isAdmin }, Media:{ media } } = useSelector(state => state);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const dispatch = useDispatch()
  let images = media?.filter(m => m.type === 'image');
  if(!isAdmin) images = shuffelArray(images)

  const photos = images?.map((img, index) => {
    return { ...img, src: img.url, width: (index % 2) + 3, height: (index % 2) + 3 }
  })

  useEffect(() => {
    if (images.length < 1) dispatch(actGetMedia());
  }, [images])

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  const { refToClose } = UseCloseOnClick(closeLightbox);

  const openLightbox = useCallback((index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);


  return (
    <div>
      {console.log("images",images)}
      <ViewGalery images={images}  currentImage={openLightbox} />
      {viewerIsOpen ? (
        <div ref={refToClose} className="overlay">
          <div className="in-overlay">
            <button onClick={closeLightbox} className="btn btn-danger in-mobile close-btn">X</button>
            <Carousel currentImage={currentImage} imageDots={true} >
              {photos.map((p, index) => <>
                <img src={p.src} />
              </>)}
            </Carousel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
export default MyGallery;