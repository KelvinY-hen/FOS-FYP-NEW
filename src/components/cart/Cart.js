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
import Switch from "@mui/material/Switch";
import {
  MdAbc
} from "react-icons/md";

const Cart = (props) => {
  const { cartContext, basketContext } = useCTX();

  const [showOrder, setShowOrder] = useState(false);
  const [success, setSuccess] = useState(false);
  const [foodser, setFoods] = useState([]);
  const [amountIsValid, setAmountIsValid] = useState(true);

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);

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


  const orderHanlder = async () => {
    console.log(basketContext.table);
    if (
      basketContext.dineIn &&
      (basketContext.table < 1 ||
        basketContext.table > 10 ||
        basketContext.table === null)
    ) {
      setAmountIsValid(false);
      return;
    } else {
      setShowOrder(true);
    }
  };


  useEffect(() => {
    DataStore.query(Foods, (f) =>
      f.restaurantID.eq(basketContext.restaurantBasket?.id)
    ).then(setFoods);
  }, [basketContext.restaurantBasket?.id]);

  const cartItems = (
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
        <div className="max-fit-screen overflow-y-auto">
          {cartItems}
          <div className={classes.total}>
            <span>Total Price</span>
            <span>{totalPrice}</span>
          </div>
          <div>
            <label htmlFor="toggle-order">Dine-in? :</label>
            <Switch
              id="toggle-order"
              checked={basketContext.dineIn}
              onChange={(e) => basketContext.setDineIn(e.target.checked)}
            />
            <label htmlFor="toggle-order">Cash Payment :</label>
            <Switch
              id="toggle-order"
              checked={basketContext.cashPayment}
              onChange={(e) => basketContext.setCashPayment(e.target.checked)}
            />
          </div>
          {!basketContext.dineIn ? (
            <div className="flex gap-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <p className="mb-3">Enter your Pickup Time:</p>
                <DateTimePicker
                  value={basketContext.dt}
                  minDateTime={basketContext.later}
                  onChange={(newDt) => basketContext.changeDateTime(newDt)}
                />
              </LocalizationProvider>
            </div>
          ) : (
            <div className="flex gap-2">
              <p>Enter your Table number:</p>
              <input
                className=" border border-solid border-1 border-gray-200 text-center"
                type="number"
                value={basketContext.table}
                min={1}
                max={20}
                step={1}
                onChange={(e) =>
                  basketContext.changeTable(parseInt(e.target.value))
                }
              />
              {!amountIsValid && (
                <p className="text-1xl text-red-500">
                  Please enter a valid table number (1-10).
                </p>
              )}
            </div>
          )}
          <div className="w-full py-5 flex items-center gap-2">
            <MdAbc className=" text-3xl text-orange-700" />
            <input
              type="text"
              required
              value={basketContext.orderNote}
              onChange={(e) => basketContext.setOrderNote(e.target.value)}
              placeholder="Leave a Note"
              className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-orange-400 text-textColor"
            />
          </div>
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
        </div>
      ) : !basketContext.cashPayment ? (
        <PaymentStripe onClose={props.onClose} />
      ) : (
        <OrderDelivered onClose={props.onClose} />
      )}
    </Modal>
  );
};

export default Cart;
