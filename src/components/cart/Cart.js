import { useContext, useState, useEffect } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "../../context/Context";
import OrderDelivered from "./OrderDelivered";
import { PaymentStripe } from "./PaymentForm";
import { useCTX } from "../../context/Context";
import { DataStore } from "aws-amplify";
import { Foods } from "../../models";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const Cart = (props) => {
  const { cartContext, basketContext } = useCTX();

  const [showOrder, setShowOrder] = useState(false);
  const [success, setSuccess] = useState(false);
  const [foodser, setFoods] = useState([]);
  const [amountIsValid, setAmountIsValid] = useState(true);


  const totalPrice = `$${basketContext.totalPrice.toFixed(2)}`;
  const hasItems = basketContext.basketDishes.length > 0;

  const cartRemove = async (item) => {
    try {
      const [foods] = await Promise.all([DataStore.query(Foods, item.foodID)]);

      await basketContext.removeDish(foods);
    } catch (error) {
      // Handle the error, e.g., display an error message or log the error
      console.error("An error occurred:", error);
    }
  };

  const cartAdd = async (item) => {
    try {
      const [foods] = await Promise.all([DataStore.query(Foods, item.foodID)]);

      await basketContext.addDish(foods, 1);
    } catch (error) {
      // Handle the error, e.g., display an error message or log the error
      console.error("An error occurred:", error);
    }
  };

  const succesSet = () => {
    setSuccess(true);
  };

  const orderHanlder = () => {

    if (basketContext.dineIn &&
       (basketContext.table < 1 ||
       basketContext.table > 10)
    ) {
      setAmountIsValid(false);
      return;
    }
    
    setShowOrder(true);
  };

  // useEffect(() => {
  //   setOwner(false)
  //   if (restaurant.id === id) {
  //     setOwner(true);
  //   } else{
  //     setOwner(false);
  //   }

  //   DataStore.query(Restaurant, id).then(setThisRestaurant)
  //   // basketContext.setRestaurantBasket(thisRestaurant)
  //   DataStore.query(Categories, (c) => c?.restaurantID.eq(id)).then(setCategory)
  //   DataStore.query(Foods, (f) => f?.restaurantID.eq(id)).then(setFood)

  // },[restaurant, id]);

  // async function fetchData() {
  //   const fetchedData = await Promise.all(
  //     basketContext.basketDishes.map(async (item) => {
  //       const [foods] = await Promise.all([
  //         DataStore.query(Foods, props.id)
  //       ]);

  //       return {
  //         foods
  //       };
  //     })
  //   );

  //   return fetchedData;
  // }

  useEffect(() => {
    DataStore.query(Foods, (f) =>
      f.restaurantID.eq(basketContext.restaurantBasket?.id)
    ).then(setFoods);
  }, [basketContext.restaurantBasket?.id]);

  // const cartItems = (
  //   <ul className={classes["cart-items"]}>
  //     {cartContext.items.map((item) => (
  //       <CartItem
  //         key={item.id}
  //         name={item.name}
  //         amount={item.amount}
  //         price={item.price}
  //         onRemove={cartRemove.bind(null, item.id)}
  //         onAdd={cartAdd.bind(null, item)}
  //       />
  //     ))}
  //   </ul>
  // );

  // const cartItems2 = (
  //   <ul className={classes["cart-items"]}>
  //     {basketContext.basketDishes.map((item) => {
  //       // const foods = await DataStore.query(Foods, item.foodID);
  //       const food = foodser.find((f) => f.id === item.foodID);
  //       return (
  //         <CartItem
  //           key={item.id}
  //           name="tempe"
  //           amount={item.quantity}
  //           price={item.quantity}
  //           onRemove={cartRemove.bind(null, item.id)}
  //           onAdd={cartAdd.bind(null, item)}
  //         />
  //       );
  //     })}
  //   </ul>
  // );

  const cartItems3 = (
    <ul className={classes["cart-items"]}>
      {basketContext.basketDishes.map &&
        basketContext.basketDishes.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            amount={item.quantity}
            onRemove={cartRemove.bind(null, item)}
            onAdd={cartAdd.bind(null, item)}
          />
        ))}
    </ul>
  );


  

  return (
    <Modal onClose={props.onClose}>
      {!showOrder ? (
        <>
          {cartItems3}
          <div className={classes.total}>
            <span>Total Price</span>
            <span>{totalPrice}</span>
          </div>
          <div>
            <label htmlFor="toggle-order">Dine-in? :</label>
            <input
              type="checkbox"
              id="toggle-order"
              checked={basketContext.dineIn}
              onChange={(e) => basketContext.setDineIn(e.target.checked)}
              className="border border-solid border-1 border-orang-500"
            />
          </div>
          {!basketContext.dineIn ? (
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <p className="mb-3">Enter your Pickup Time:</p>
                <DateTimePicker
                  value={basketContext.dt}
                  onChange={(newDt) => basketContext.changeDateTime(newDt)}
                />
              </LocalizationProvider>
            </div>
          ) : (
            <div>
              <p>Enter your Table number:</p>
              <input
                className=" border border-solid border-1 border-gray-200 text-center"
                type="number"
                value={basketContext.table}
                min={1}
                max={20}
                step={1}
                onChange={(e) => basketContext.changeTable(parseInt(e.target.value))}
              />
              {!amountIsValid && <p className="text-1xl text-red-500">Please enter a valid table number (1-20).</p>}
            </div>
            
          )}
          <div className={classes.actions}>
            <button className={classes["button--alt"]} onClick={props.onClose}>
              Close
            </button>
            {hasItems && (
              <button className={classes.button} onClick={orderHanlder}>
                Order
              </button>
            )}
          </div>
        </>
      ) : (
        <PaymentStripe onClose={props.onClose} />
      )}
    </Modal>
  );
};

export default Cart;
