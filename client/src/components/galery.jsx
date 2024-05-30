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
  const [images, setImages] = useState([]);

  const dispatch = useDispatch()


  function randomColSize(index){
    var row = 0;
    return () => {
        if (row === 12) row = 0;
        let random = Math.ceil(Math.random() * 4) + 1;
        if ((row + random) > 12) random = 12 - row;
        row = row + random;
        return random;
    }
}

const setImagesWidth = (_images) => {
  let getCol = randomColSize();
  const imagesWithWidth = _images.map(img => ({...img, col: isAdmin ? 3 : getCol()}))
  return imagesWithWidth
}

  useEffect(() => {
    console.log('suffellllllll')
    let _images = media?.filter(m => m.type === 'image');
    if(!isAdmin) _images = shuffelArray(_images)
    _images = setImagesWidth(_images)
    setImages(_images)
  }, [media])

  const photos = images?.map((img, index) => {
    return { ...img, src: img.url, width: (index % 2) + 3, height: (index % 2) + 3 }
  })

  useEffect(() => {
    if (images?.length < 1) dispatch(actGetMedia());
  }, [images])

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  const { refToClose } = UseCloseOnClick(closeLightbox);

  const openLightbox = useCallback((index) => {
    console.log('image index', index)
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