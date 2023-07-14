import React from "react";
import classes from "./FoodItems.module.css";
import FoodQuantityForm from "./FoodQuantityForm";
import { useContext, useState, useEffect } from "react";
import CartContext from "../../context/Context";
import { useCTX } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { Button } from "@aws-amplify/ui-react";
import { DataStore, Storage } from "aws-amplify";
import { Foods } from "../../models";

const FoodItems = (props) => {
  const [dish, setDish] = useState(null);
  const { cartContext, basketContext } = useCTX();
  const price = `$${props.price.toFixed(2)}`;
  const [foodImage, setFoodImage] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      try {
        if (!props.image) {
          return;
        } else {
          const img = await Storage.get(props.image, { expires: 60 });
          console.log(img);
          console.log(props.image);
          setFoodImage(img);
        }
      } catch (error) {
        // Handle the error, e.g., display an error message or log the error
        console.error("An error occurred:", error);
      }
    };
    getImage();
  }, []);

  const addToCartHandler = async (amount) => {
    try {
      const [foods] = await Promise.all([DataStore.query(Foods, props.id)]);

      await basketContext.addDish(foods, amount);
    } catch (error) {
      // Handle the error, e.g., display an error message or log the error
      console.error("An error occurred:", error);
    }
  };

  console.log(props.hide);

  return (
    <li className={classes.food}>
      <div className="flex gap-2">
        <div>
          {props.image && (
            <img src={foodImage} alt={props.name} className=" w-32 md:h-32 hidden md:flex " />
          )}
        </div>
        <div>
          <h3>{props.name} </h3>
          <div className={classes.description}>{props.description}</div>
          <div className={classes.price}>{price}</div>
        </div>
      </div>
      <div>
        {props.hide && (
          <h3 className=" opacity-20 font-bold text-sky-700 text-1xl md:text-5xl text-center z-0 justify-items-center ">
            Hidden
          </h3>
        )}
      </div>
      <div>
        <FoodQuantityForm id={props.id} onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
};

export default FoodItems;
