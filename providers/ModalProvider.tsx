'use client'
import { useState, useEffect } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    //* Never render modals in SSR
    useEffect( () => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            Modals!
        </>
    );
}