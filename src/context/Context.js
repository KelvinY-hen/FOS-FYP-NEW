import React, { useContext } from "react";
const CartContext = React.createContext({});

const RestaurantContext = React.createContext({});

export const useCTX = () => useContext(CartContext)


export default CartContext;
