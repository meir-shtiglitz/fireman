import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UseCloseOnClick from "../hooks/closeOnClick";
import "../css/nav.scss";
import logo from "../assets/images/logo.png";
import { UseMenuScroll } from "../hooks/useMenuScroll";
import { UseNavScroller } from "../hooks/useNavScroller";
import { useDispatch, useSelector } from "react-redux";
import { actLogout } from "../redux/actions/user";

const Nav = () => {
    const {toScroll} = UseNavScroller();
    const { isAdmin } = useSelector(state => state.User);
    console.log('isAdmin from nav', isAdmin)
    const { menuRef, scrollToSection } = UseMenuScroll();
    const [showeNav, setShowNav] = useState(false);
    const [isHomeActive, setIsHomeActive] = useState();
    const {refNotClose} = UseCloseOnClick(()=>setShowNav(false));
    const isActive = (path) => window.location.href.includes(path) && 'selected';
    const dispatch = useDispatch()

    useEffect(()=>{
        console.log('isAdmin from effect', isAdmin)

    }, [isAdmin])
console.log('showeNav',showeNav)
    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light ${isHomeActive && 'home-active'} ${showeNav && 'show'}`}>
            <Link className="navbar-brand" to="/"><img width={150} src={logo} alt="logo" /></Link>
            <button ref={refNotClose} onClick={()=>setShowNav(!showeNav)} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${showeNav && 'show'}`} id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink onClick={toScroll} end style={ ({isActive}) => setIsHomeActive(isActive)} className={`nav-link ${!isActive('#') && 'selected'}`} to="/">בית</NavLink>
                    </li>
                    {!isAdmin && <li className="nav-item">
                        <NavLink onClick={toScroll} end className={`nav-link ${isActive('about')}`} to="/#about">אודות</NavLink>
                    </li>}
                    <li className="nav-item">
                        <NavLink end className="nav-link selected" to="/galery">גלריה</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink end className="nav-link selected" to="/videos">סרטונים</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink end className="nav-link selected" to="/recommends">המלצות</NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink activeClassName="active" end className="nav-link" to="/magics/word">קסמים</NavLink>
                    </li> */}
                    {!isAdmin && <li className="nav-item">
                        <NavLink onClick={toScroll} end className={`nav-link ${isActive('contact')}`} to="/#contact">צור קשר</NavLink>
                    </li>}
                    {isAdmin && <li className="nav-item">
                        <NavLink end className="nav-link selected" to="/uploadfiles">העלאת קבצים</NavLink>
                    </li>}
                    {isAdmin && <li onClick={() => dispatch(actLogout())} className="nav-item">
                        <NavLink end className="nav-link" to="/">התנתק</NavLink>
                    </li>}
                </ul>
            </div>
        </nav>
    )
}
export default Nav;