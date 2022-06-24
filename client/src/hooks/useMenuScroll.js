import { useEffect, useRef } from "react";

export const UseMenuScroll = () => {
    const menuRef = useRef();
    useEffect(()=>{
        if(!menuRef.current) return;
        menuRef.current.addEventListener('click', scrollToSection )
    },[])

    const scrollToSection = (e) => {
        if(!e || !e.target) return;
        const elementId = e.target?.href?.split('#')?.[1]
        console.log(elementId);
        const element = document.getElementById(elementId);
        element && window.scrollTo(0, element.offsetTop);
    }

    return {menuRef, scrollToSection};
}