import { defaultCartState } from "./initialState";

export const actionType ={
    SET_USER : 'SET_USER'
}

const  reducer = (state,action) => {
    console.log(action) 

    switch(action.type){
        case actionType.SET_USER:
            return{
                ...state,
                user: action.user,
            }

            default:
                return state;
    }
    
}
const cartReducer = (state, action) => {
    if (action.type === "ADD") {
      const updatedtotalPrice =
        state.totalPrice + action.item.price * action.item.amount;
  
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      const existingCartItem = state.items[existingCartItemIndex];
      let updatedItems;
  
      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.item.amount,
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }
  
      return {
        items: updatedItems,
        totalPrice: updatedtotalPrice,
      };
    }
  
    if (action.type === "REMOVE") {
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const existingItem = state.items[existingCartItemIndex];
      const updatedtotalPrice = state.totalPrice - existingItem.price;
      let updatedItems;
      if (existingItem.amount === 1) {
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }
  
      return {
        items: updatedItems,
        totalPrice: updatedtotalPrice,
      };
    }
  
    if (action.type === "CLEAR") {
      return {
        items: [],
        totalPrice: 0,
      };
    }
  
    return defaultCartState;
  };

export default reducer