import { createContext,useContext, useEffect, useState } from "react";
import { Auth,DataStore } from "aws-amplify";
import { Restaurant } from "../models";

const RestaurantContext = createContext({});

const RestaurantContextProvider = ({children}) => {
    const [user,setUser] = useState();
    const [restaurant, setRestaurant] = useState();
    const sub = user?.attributes?.sub;

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: true}).then(setUser)
    }, [])

    console.log(user)

    return <RestaurantContextProvider>{children}</RestaurantContextProvider>
}

export default RestaurantContextProvider;