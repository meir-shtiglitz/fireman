import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Route, Routes } from "react-router-dom";
import About from './components/about';
import MagicWord from './components/magicWord';
import Fire from './components/fire';
import Home from './components/home';
import Contact from './components/contact';
import Nav from './components/nav';
import Carousel from './components/carousel';
import Recommend from './components/recommendsEdit';
import NewRecommend from './components/new-recommend';
import RecommendEdit from './components/recommendsEdit';
import Recommends from './components/recommends';
import Auth from './components/auth';
import MyGallery from './components/galery';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { actLoginByToken } from './redux/actions/user';
import Videos from './components/videos';
import AproveVideo from './components/aproveVideo';
import InputFiles from './components/inputFiles';
import Loader from './components/loader';
import AdminRoute from './components/adminRoute';
import InBuildPage from './components/in_build_page';

function App() {

  const dispatch = useDispatch();
  const {isLoading} = useSelector(store => store.Loader);
  
  useEffect(()=>{
    dispatch( actLoginByToken() );
  },[])

  return (
    <>
    {isLoading && <Loader />}
    <>
      <div className="wrap-nav">
        <Nav />
      </div>
      <div className="App">
        <Routes>
          {/* <Route exact path="/" element={<Home />} /> */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Auth />} />
          <Route exact path="/register" element={<Auth regMode={true} />} />
          {/* <Route exact path="/about" element={<About />} /> */}
          {/* <Route exact path="/contact" element={<Contact />} /> */}
          {/* <Route exact path="/galery" element={<MyGallery />} /> */}
          <Route exact path="/galery" element={<MyGallery />} />

          {/* <Route path="/magics/word" element={<MagicWord />} /> */}
          <Route path="/fire" element={<Fire />} />
          <Route path="/car" element={<Carousel />} />
          <Route path="/new/recommend" element={<NewRecommend />} />
          <Route path="/recommends" element={<Recommends />} />
          <Route path="/recommend/edit/:recID" element={<RecommendEdit />} />
          {/* <Route path="videos" element={<Videos />} /> */}
          <Route exact path="/videos" element={<Videos />} />
          <Route path="aprove/video/:src/:ID" element={<AproveVideo />} />
          <Route path="uploadfiles" element={<AdminRoute Component={<InputFiles uploadMode={true} />}/>} />
          <Route path="/build/page" element={<InBuildPage />} />
        </Routes>
      </div>
      </>
    </>
  );
}

export default App;
