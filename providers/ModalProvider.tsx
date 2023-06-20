'use client'

import { useState, useEffect } from "react";

import { AuthModal } from "@/components/AuthModal";

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
            <AuthModal/>
        </>
    );
}