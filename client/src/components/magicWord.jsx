import { useEffect, useRef, useState } from "react";
import "../css/magicWord.css"
import Fire from "./fire";
import predictWord from "../assets/videos/predictword.mp4";
import dragon from "../assets/images/dragon.png";
import { Link } from "react-router-dom";

const MagicWord = () => {
    const [word, setWord] = useState('boom');
    const [showWord, setShowWord] = useState(false);
    const [fire, setFire] = useState(false);
    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.addEventListener('play', play);
        return () => {
            int && clearInterval(int);
        }
    }, [])

    const inputer = (e) => {
        setWord(e.target.value)
    }

    const fireSubmit = (e) => {
        e.preventDefault();
        setFire(true);
        console.log(word);
        setTimeout(() => setFire(false), 5000);
    }

    let int;
    const play = (e) => {
        if (int) return;
        int = setInterval(() => {
            const time = videoRef.current.currentTime;
            console.log(time);
            if (time > 31 && time < 33.200) {
                !showWord && setShowWord(true);
            } else {
                setShowWord(false);
            }
        }, 100)
    }


    return (
        <div className="magic-word">
            <Link to="/fire">Fire</Link>
            <div className="final-video">
                {/* <iframe allow="autoplay" src="https://www.youtube.com/embed/D9RZqulqhU0"></iframe> */}
                <video ref={videoRef} controls onClick={play} src={predictWord}></video>
                {showWord && <h2 className="prediction">{word}</h2>}
            </div>
            <div className="wrap-magic-word">
                <h1>תחשוב על מילה בת ארבע אותיות</h1>
                <h2>תכתוב אותה על הקלף ושרוף אותו באש</h2>
                <form onSubmit={fireSubmit}>
                    <div className="form-group wrap-input">
                        <input onInput={inputer} value={word} type="text" className="form-control" />
                    </div>
                    <button type="submit"><img src={dragon} alt="dragon" /></button>
                </form>
                {fire && <Fire />}
            </div>
        </div>
    )
}

export default MagicWord;