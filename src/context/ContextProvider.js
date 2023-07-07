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
  User,
} from "../models/index.js";
import {
  PredicateAll,
  Predicates,
} from "@aws-amplify/datastore/lib-esm/predicates/index.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ContextProvider = (props) => {
  const [user, setUser] = useState();
  const [dbUser, setDBUser] = useState();
  const [restaurant, setRestaurant] = useState([]);

  const sub = user?.attributes?.sub;

  const [restaurantBasket, setRestaurantBasket] = useState();
  const [basket, setBasket] = useState(null);
  const [basketDishes, setBasketDishes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dt, setDt] = useState(dayjs());
  const [table, setTable] = useState(null);
  const [dineIn, setDineIn] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setUser);
  }, []);

  /// Change Context for Account Sub when Changing Account
  useEffect(() => {
    const createUser = async () => {
      try {
        const user = await DataStore.save(
          new User({
            name: "not Entered",
            contactNumber: null,
            sub: sub,
          })
        );
        setDBUser(user);
      } catch (e) {
        console.log(e);
      }
    };

    const checkUser = async () => {
      const tempUser = await DataStore.query(User, (u) => u.sub.eq(sub));

      if (tempUser) {
        setDBUser(tempUser);
      } else {
        await createUser();
      }
    };

    if (!sub) {
      return;
    }

    DataStore.query(Restaurant, (r) => r.adminSub.eq(sub)).then((restaurants) =>
      setRestaurant(restaurants[0])
    );

    checkUser();
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
    setTable(null);
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
    setTable(null);
    setDt(newDt);
  };

  const changeTable = (table) => {
    setTable(table);
    setDt(dayjs());
  };

  console.log(dbUser);

  const ClearDishFromBasket = async (dish, quantity) => {
    // get the existing basket or create a new one
    setBasketDishes([]);
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
    console.log(dt);
    const awsDateTime = dt.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    console.log(awsDateTime);
    var type = "DINEIN";
    console.log(type);
    if (dineIn === false) {
      type = "PICKUP";
      setTable(0);
    }
    const newOrder = await DataStore.save(
      new Order({
        userID: sub,
        restaurantID: restaurantBasket.id,
        status: "RECEIVED",
        totalPrice: totalPrice,
        DateTime: awsDateTime.toString(),
        table: table,
        Type: type,
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

  console.log(restaurantBasket);
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
    clearDish: ClearDishFromBasket,
    createOrder: createOrder,
    changeDateTime,
    dt,
    table,
    changeTable,
    dineIn,
    setDineIn,
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
