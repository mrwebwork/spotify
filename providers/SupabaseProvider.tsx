"use client"

import { useState, useEffect } from "react";

import { Database } from "@/types_db";
import { createClientComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SupabaseProviderProps {
    children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
    children
}) => {
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

    useEffect(() => {
        const client = createClientComponentClient<Database>();
        setSupabaseClient(client);
    }, []);

    if (!supabaseClient) {
        return null; //* or a loading spinner
    }

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    );
}
