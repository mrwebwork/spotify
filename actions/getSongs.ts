import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"

//* Fetch song data 
export const getSongs = async (): Promise<Song[]> => {
    //* Create a Supabase client for server-side usage, passing cookies for session handling
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    //* Make a request to fetch all records from the 'songs' table, ordered by creation date
    const {data, error} = await supabase 
    .from('songs')
    .select('*')
    .order('created_at', {ascending: false});

    if (error) {
       console.log(error) 
    }

    return (data as any) || [];
}