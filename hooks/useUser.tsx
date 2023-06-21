import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { UserDetails, Subscription } from "@/types";
import { useState, createContext, useEffect, useContext } from "react";

//* Define a type for the user context
type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

//* Create a user context with the above type
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

//* Define a interface for component props
export interface Props {
    [propName: string]: any;
}

//* Define a user context provider component
export const MyUserContextProvider = (props: Props) => {
    //* Use the session context hook to get the session and loading status
    const {
        session, 
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();

    //* Use the Supabase user hook to get the user
    const user = useSupaUser();

    //* Get the access token from the session, or null if it doesn't exist
    const accessToken = session?.access_token ?? null;

    //* Create a state for loading data, user details, and subscription
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    //* Define functions to get user details and subscription from Supabase
    const getUserDetails = () => supabase.from('users').select('*').single();
    const getSubscription = () => supabase.from('subscriptions').select('*, prices(*, products(*))').in('status', ['trialing', 'active']).single();

    //* Fetch user info
    useEffect(() => {
        //* If user exists and data is not loading, fetch data
        if(user && !isLoadingData && !userDetails && !subscription){
            setIsLoadingData(true);

            //* Use Promise.allSettled to fetch user details and subscription
            Promise.allSettled([getUserDetails(), getSubscription()])
                .then(([userDetailsPromise, subscriptionPromise]) => {
                    //* If the user details promise is fulfilled, set the user details state
                    if (userDetailsPromise.status === 'fulfilled') {
                        setUserDetails(userDetailsPromise.value?.data as UserDetails);
                    } else {
                        //! Log an error if the promise is rejected
                        console.error(userDetailsPromise.reason);
                    }

                    //* If the subscription promise is fulfilled, set the subscription state
                    if (subscriptionPromise.status === 'fulfilled') {
                        setSubscription(subscriptionPromise.value?.data as Subscription);
                    } else {
                        //! Log an error if the promise is rejected
                        console.error(subscriptionPromise.reason);
                    }
                    
                    setIsLoadingData(false);
            });
        } else if(!user && !isLoadingUser && !isLoadingData){
            //* If user does not exist and data is not loading, reset user details and subscription
            setUserDetails(null)
            setSubscription(null)
        }
    }, [user, isLoadingUser]); //* Run effect when user or loading user state changes

    //* Define the value to pass to the user context
    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props}/>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider')
    }
    return context;
}