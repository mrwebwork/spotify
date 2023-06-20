'use client'

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
    return (
        <Toaster
        toastOptions={{
            style:{
                background: '#333',
                color: '#fff'
            }
        }}
        />
    )
}