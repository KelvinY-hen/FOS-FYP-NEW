import CartContext from "./Context.js";
import { RestaurantContext } from "./Context.js";
import { useReducer } from "react";
import { ModelPredicate, SortDirection } from "@aws-amplify/datastore";
import { useContext, useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import {
  Restaurant,
  Cart,
  Foods,
  CartFood,
  Order,
  OrderFood,
  Categories,
} from "../models/index.js";
import {
  PredicateAll,
  Predicates,
} from "@aws-amplify/datastore/lib-esm/predicates/index.js";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// const cartReducer = (state, action) => {
//   if (action.type === "ADD") {
//     const updatedTotalPrice = state.totalPrice + action.item.price * action.item.amount;

//     const existingCartItemIndex = state.items.findIndex(
//       (item) => item.id === action.item.id
//     );
//     const existingCartItem = state.items[existingCartItemIndex];
//     let updatedItems;

//     if (existingCartItem) {
//       const updatedItem = {
//         ...existingCartItem,
//         amount: existingCartItem.amount + action.item.amount,
//       };
//       updatedItems = [...state.items];
//       updatedItems[existingCartItemIndex] = updatedItem;
//     } else {
//       updatedItems = state.items.concat(action.item);
//     }

//     return {
//       items: updatedItems,
//       totalPrice: updatedTotalPrice,
//     };
//   }

//   if (action.type === "REMOVE") {
//     const existingCartItemIndex = state.items.findIndex(
//       (item) => item.id === action.id
//     );
//     const existingItem = state.items[existingCartItemIndex];
//     const updatedtotalprice = state.totalPrice - existingItem.price;
//     let updatedItems;
//     if (existingItem.amount === 1) {
//       updatedItems = state.items.filter((item) => item.id !== action.id);
//     } else {
//       const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
//       updatedItems = [...state.items];
//       updatedItems[existingCartItemIndex] = updatedItem;
//     }

//     return {
//       items: updatedItems,
//       totalPrice: updatedtotalprice,
//     };
//   }

//   if (action.type === "CLEAR") {
//     return {
//       items: [],
//       totalPrice: 0,
//     };
//   }

//   return defaultCartState;
// };

const ContextProvider = (props) => {
  const [user, setUser] = useState();
  const [restaurant, setRestaurant] = useState([]);
  const sub = user?.attributes?.sub;

  const [restaurantBasket, setRestaurantBasket] = useState();
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dt, setDt] = useState(dayjs());

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setUser);
  }, []);

  /// Change Context for Account Sub when Changing Account
  useEffect(() => {
    if (!sub) {
      return;
    }

    DataStore.query(Restaurant, (r) => r.adminSub.eq(sub)).then((restaurants) =>
      setRestaurant(restaurants[0])
    );
  }, [sub]);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      const totalPrice = await basketDishes.reduce(
        async (sumPromise, basketDish) => {
          const sum = await sumPromise;
          console.log(basketDish);
          const [foods] = await Promise.all([
            DataStore.query(Foods, basketDish.foodID),
          ]);
          const dishPrice = basketDish.quantity * foods.price;
          return sum + dishPrice;
        },
        Promise.resolve(0)
      );

      setTotalPrice(totalPrice);
    };
    calculateTotalPrice();
  }, [basketDishes]);

  useEffect(() => {
    {
      restaurantBasket &&
        DataStore.query(Cart, (b) =>
          b.and((b) => [
            b.restaurantID.eq(restaurantBasket.id),
            b.userID.eq(sub),
          ])
        ).then((baskets) => setBasket(baskets[0]));
    }
    setDt(dayjs());
  }, [user, restaurantBasket]);

  useEffect(() => {
    if (basket) {
      DataStore.query(CartFood, (cf) => cf.cartID.eq(basket.id)).then(
        setBasketDishes
      );
    } else {
      setBasketDishes([]);
    }
  }, [basket]);

  const addDishToBasket = async (food, quantity) => {
    // get the existing basket or create a new one
    let theBasket = basket || (await createNewBasket());
    await DataStore.query(CartFood, (cf) =>
      cf.and((cf) => [cf.foodID?.eq(food.id), cf.cartID.eq(basket.id)])
    ).then(async (cf) => {
      if (cf.length > 0) {
        console.log(cf);
        const existingCartFood = cf[0];
        const newQuantity = existingCartFood.quantity + quantity;

        // Update the quantity of the existing CartFood item
        await DataStore.save(
          CartFood.copyOf(existingCartFood, (updated) => {
            updated.quantity = newQuantity;
          })
        );

        const updatedBasketDishes = basketDishes.map((basketDish) => {
          if (basketDish.foodID === food.id) {
            return { ...basketDish, quantity: newQuantity };
          }
          return basketDish;
        });
        setBasketDishes(updatedBasketDishes);
      } else {
        const newDish = await DataStore.save(
          new CartFood({ quantity, foodID: food.id, cartID: theBasket.id })
        );
        setBasketDishes([newDish]);
      }
      // If dish.id was not found in the cart, create a new BasketDish item and save it to DataStore
    });
  };

  const removeDishFromBasket = async (food) => {
    // get the existing basket or create a new one
    let theBasket = basket;

    // create a BasketDish item and save to Datastore
    await DataStore.query(CartFood, (cf) =>
      cf.and((cf) => [cf.foodID?.eq(food.id), cf.cartID.eq(basket.id)])
    ).then(async (cf) => {
      if (cf[0].quantity > 1) {
        const existingCartFood = cf[0];
        const newQuantity = existingCartFood.quantity - 1;

        // Update the quantity of the existing CartFood item
        await DataStore.save(
          CartFood.copyOf(existingCartFood, (updated) => {
            updated.quantity = newQuantity;
          })
        );

        const updatedBasketDishes = basketDishes.map((basketDish) => {
          if (basketDish.foodID === food.id) {
            return { ...basketDish, quantity: newQuantity };
          }
          return basketDish;
        });
        setBasketDishes(updatedBasketDishes);
      } else {
        setBasketDishes(basketDishes.filter((bd) => bd.id !== cf[0].id));
        DataStore.delete(cf[0]);
      }
    });
  };

  const changeDateTime = (newDt) => {
    setDt(newDt)
  }

  const ClearDishFromBasket = async (dish, quantity) => {
    // get the existing basket or create a new one
    let theBasket = basket || (await createNewBasket());

    // create a BasketDish item and save to Datastore
    const newDish = await DataStore.save(
      new CartFood({ subTotal: quantity, Dish: dish, basketID: theBasket.id })
    );

    setBasketDishes([...basketDishes, newDish]);
  };

  const createNewBasket = async () => {
    const newBasket = await DataStore.save(
      new Cart({ userID: sub, restaurantID: restaurantBasket.id })
    );
    setBasket(newBasket);
    return newBasket;
  };

  // const [cartState, dispatchCartAction] = useReducer(
  //   cartReducer,
  //   defaultCartState
  // );

  // const addToCart = (item) => {
  //   dispatchCartAction({ type: "ADD", item: item });
  // };

  // const removeFromCart = (id) => {
  //   dispatchCartAction({ type: "REMOVE", id: id });
  // };

  // const clearFromCart = () => {
  //   dispatchCartAction({ type: "CLEAR" });
  // };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    DataStore.query(Order, (o) => o.userID.eq(sub)).then(setOrders);
  }, [sub]);

  const createOrder = async () => {
    // create the order
    console.log("order memek");
    console.log(dt)
    const awsDateTime = dt.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    console.log(awsDateTime)
    const newOrder = await DataStore.save(
      new Order({
        userID: sub,
        restaurantID: restaurantBasket.id,
        status: "RECEIVED",
        totalPrice: totalPrice,
        DateTime: awsDateTime .toString()
      })
    );
    console.log("memek2");
    console.log(newOrder);

    // add all basketDishes to the order
    await Promise.all(
      basketDishes.map((basketDish) =>
        DataStore.save(
          new OrderFood({
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            foodsID: basketDish.foodID,
          })
        )
      )
    );

    // delete basket
    await DataStore.delete(basket);

    setOrders([...orders, newOrder]);

    return newOrder;
  };

  const cartContext = {
    // items: cartState.items,
    // totalPrice: cartState.totalPrice,
    // addItem: addToCart,
    // removeItem: removeFromCart,
    // clearall: clearFromCart
  };

  const basketContext = {
    setRestaurantBasket,
    restaurantBasket,
    basket,
    basketDishes,
    totalPrice,
    addDish: addDishToBasket,
    removeDish: removeDishFromBasket,
    createOrder: createOrder,
    changeDateTime,
    dt
  };

  const ContextValue = {
    cartContext,
    restaurant,
    basketContext,
  };

  return (
    <CartContext.Provider value={ContextValue}>
      {props.children}
    </CartContext.Provider>
  );
};

export default ContextProvider;
