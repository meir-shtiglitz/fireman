import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UseCloseOnClick from "../hooks/closeOnClick";
import "../css/nav.scss";
import logo from "../assets/images/logo.png";
import { UseMenuScroll } from "../hooks/useMenuScroll";

const Nav = () => {
    const { menuRef, scrollToSection } = UseMenuScroll();
    const [showeNav, setShowNav] = useState(true);
    const [isHomeActive, setIsHomeActive] = useState();
    const {refNotClose} = UseCloseOnClick(()=>setShowNav(false));


    return (
        <nav className={`navbar navbar-expand-lg navbar-light bg-light ${isHomeActive && 'home-active'}`}>
            <Link className="navbar-brand" to="/"><img width={150} src={logo} alt="logo" /></Link>
            <button ref={refNotClose} onClick={()=>setShowNav(!showeNav)} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${showeNav && 'show'}`} id="navbarNav">
                <ul ref={menuRef} className="navbar-nav">
                    <li className="nav-item active">
                        <NavLink onClick={scrollToSection} end activeClassName="active" style={ ({isActive}) => setIsHomeActive(isActive)} className="nav-link" to="/">בית</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink onClick={scrollToSection} end activeClassName="active" className="nav-link" to="/#about">אודות</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" end className="nav-link" to="/galery">גלריה</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" end className="nav-link" to="/videos">סרטונים</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName="active" end className="nav-link" to="/recommends">המלצות</NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink activeClassName="active" end className="nav-link" to="/magics/word">קסמים</NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink onClick={scrollToSection} activeClassName="active" end className="nav-link" to="/#contact">צור קשר</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default Nav;