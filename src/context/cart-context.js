import React from "react";
const CartContext = React.createContext({
  items: [],
  totalPrice: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearall: () => {},
  payment: (false)
});

export default CartContext;
