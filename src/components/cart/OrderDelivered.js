import { Fragment } from "react";
import classes from "./Cart.module.css";
import { useContext } from "react";
import CartContext from "../../context/Context";
import { clear } from "@testing-library/user-event/dist/clear";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import { useCTX } from "../../context/Context";
import { motion } from "framer-motion";

import { DataStore } from "aws-amplify";
import { Ingredient, FoodIngredient } from "../../models";

const OrderDelivered = (props) => {
  const { cartContext, restaurant, basketContext } = useCTX();
  const [success, setSuccess] = useState(false);
  const [ingredientList, setIngredient] = useState([]);
  const [foodIngredientList, setFoodIngredient] = useState([]);

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const [ingredients, foodIngredients] = await Promise.all([
          DataStore.query(Ingredient),
          DataStore.query(FoodIngredient),
        ]);

        for (const item of basketContext.basketDishes) {
          console.log("tempe");
          console.log(item);
          console.log(foodIngredientList);

          const foodIngredientItem = foodIngredients.find(
            (ing) => ing.foodsID === item.foodID
          );
          console.log(foodIngredientItem);
          if (!foodIngredientItem) {
            continue;
          }

          const ingredientItem = ingredients.find(
            (ing) => ing.id === foodIngredientItem.ingredientID
          );
          console.log(ingredientItem);
          if (!ingredientItem) {
            continue;
          }

          var newQuantity = ingredientItem.quantity - foodIngredientItem.recipeQuantity * item.quantity;
          console.log(newQuantity);

          await DataStore.save(
            Ingredient.copyOf(ingredientItem, (updated) => {
              updated.quantity = newQuantity;
            })
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const confirmOrder = async () => {
      await basketContext.createOrder();
    }
    // const handleAction = async () => {
    //   console.log("didalam");
    //   console.log(foodIngredientList)

    //   if (foodIngredientList.length === 0) {
    //     console.log("Food ingredient list is empty");
    //     return;
    //   }

    //   for (const item of cartContext.items) {
    //     console.log("tempe");
    //     console.log(item.id);
    //     console.log(foodIngredientList);

    //     const foodIngredientItem = foodIngredientList.find(
    //       (ing) => ing.foodsID === item.id
    //     );
    //     console.log(foodIngredientItem);
    //     if (!foodIngredientItem) {
    //       continue;
    //     }

    //     const ingredientItem = ingredientList.find(
    //       (ing) => ing.id === foodIngredientItem.ingredientID
    //     );
    //     console.log(ingredientList);
    //     if (!ingredientItem) {
    //       continue;
    //     }

    //     const newQuantity =
    //       ingredientItem.quantity - foodIngredientItem.recipeQuantity * item.amount;
    //     console.log(newQuantity);

    //     await DataStore.save(
    //       Ingredient.copyOf(ingredientItem, (updated) => {
    //         updated.quantity = newQuantity;
    //       })
    //     );
    //   }
    // };
    // fetchData();
    // handleAction();
    confirmOrder();
  }, [restaurant]);

  // const onCreateOrder = async () => {
  //   const newOrder = await basketContext.createOrder();
  // };

  const clearall = () => {
    basketContext.clearDish();
  };

  return (
    <Fragment>
      {fields && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
              alertStatus === "danger"
                ? "bg-red-400 text-red-800"
                : "bg-emerald-400 text-emerald-800"
            }`}
          >
            {msg}
          </motion.p>
        )}
      <section>
        <h2>Thank you so much for your order!</h2>
        <p>We really appreciate it. </p>
      </section>
      <div className={classes.actions}>
        <button
          className={classes["button--alt"]}
          onClick={() => {
            props.onClose();
            // onCreateOrder()
            clearall();
          }}
        >
          Close
        </button>
      </div>
    </Fragment>
  );
};

export default OrderDelivered;
