import classes from "./CartItem.module.css";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import { Foods, CartFood } from "../../models";

const CartItem = (props) => {

  const [cartFood, setCartFood] = useState(null);
  const [food, setFood] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    DataStore.query(CartFood, props.id).then(setCartFood);
  }, [props]);

  useEffect(() => {
    DataStore.query(Foods, cartFood?.foodID).then(setFood)
  }, [cartFood?.foodID])
  

  useEffect(() => {
    setPrice(`$${food?.price.toFixed(2)}`) ;
  },[food?.price])
  

  return (
    <li className={classes["cart-item"]}>
      <div>
        <h2>{food?.name}</h2>
        <div className={classes.summary}>
          <span className={classes.price}>{price}</span>
          <span className={classes.amount}>x {props.amount}</span>
        </div>
      </div>
      <div className={classes.actions}>
        <button onClick={props.onRemove}>−</button>
        <button onClick={props.onAdd}>+</button>
      </div>
    </li>
  );
};

export default CartItem;
