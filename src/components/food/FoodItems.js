import React from "react";
import classes from "./FoodItems.module.css";
import FoodQuantityForm from "./FoodQuantityForm";
import { useContext, useState } from "react";
import CartContext from "../../context/Context";
import { useCTX } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { Button } from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
import { Foods } from "../../models";

const FoodItems = (props) => {
  const [dish, setDish] = useState(null);
  const { cartContext, basketContext } = useCTX();
  const price = `$${props.price.toFixed(2)}`;
  const addToCartHandler = async (amount) => {
    try {
      const [foods] = await Promise.all([DataStore.query(Foods, props.id)]);

      await basketContext.addDish(foods, amount);
    } catch (error) {
      // Handle the error, e.g., display an error message or log the error
      console.error("An error occurred:", error);
    }
  };

  return (
    <li className={classes.food}>
      <div>
        <h3>{props.name}</h3>
        <div className={classes.description}>{props.description}</div>
        <div className={classes.price}>{price}</div>
      </div>

      <div>
        <FoodQuantityForm id={props.id} onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
};

export default FoodItems;
