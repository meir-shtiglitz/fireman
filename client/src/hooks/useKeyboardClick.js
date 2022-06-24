import React, { useEffect } from 'react'

export function UseKeyboardClick(key, func) {
    useEffect(() => {
        document.addEventListener('keydown', keyPressed);
        return () => document.removeEventListener('keydown', keyPressed)
    },[])
    const keyPressed = (e) => {
        if(e.key === key){
            func()
        }
    }
}