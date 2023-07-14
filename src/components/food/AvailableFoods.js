import classes from "./AvailableFoods.module.css";
import Card from "../UI/Card";
import FoodItems from "./FoodItems";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DataStore, SortDirection } from "aws-amplify";
import { Foods, Categories, Restaurant } from "../../models";
import { Button } from "@aws-amplify/ui-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCTX } from "../../context/Context";
const AvailableFoods = () => {
  const { restaurant, basketContext } = useCTX();
  const { id } = useParams();

  const [foodList, setFood] = useState([]);
  const [thisRestaurant, setThisRestaurant] = useState([]);
  const [categoryList, setCategory] = useState([]);
  const navigate = useNavigate();

  const [fields, setFields] = useState(false);
  const [owner, setOwner] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setOwner(false);
    if (restaurant) {
      if (restaurant.id === id) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    }

    DataStore.query(Restaurant, id).then(setThisRestaurant);
    // basketContext.setRestaurantBasket(thisRestaurant)
    DataStore.query(Categories, (c) => c?.restaurantID.eq(id), {
      sort: (s) => s.name(SortDirection.DESCENDING),
    }).then(setCategory);
    DataStore.query(Foods, (f) => f?.restaurantID.eq(id)).then(setFood);
  }, [restaurant, id]);

  useEffect(() => {
    basketContext.setRestaurantBasket(thisRestaurant);
  }, [thisRestaurant]);

  const modifyFood = (category) => {
    owner && navigate(`/Categories/${category.id} `);
  };

  const deleteFood = (food) => {
    DataStore.delete(food);
    setFood(foodList.filter((f) => f.id !== food.id));

    setFields(true);
    setMsg("Data Deleted Succesfully");
    setAlertStatus("success");
    setTimeout(() => {
      setFields(false);
    }, 4000);
  };

  const [filter, setFilter] = useState("Meat");
  useEffect(() => {}, [filter]);

  const foodsList2 = foodList.map((food) => {
    const dateObj = new Date(food.updatedAt);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString();
    if (food.hide === true && owner === false) {
      return null;
    }
    if (filter === food.categoriesID) {
      return (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        > 
          <Card>
            <FoodItems
              id={food.id}
              key={food.id}
              name={food.name}
              image={food.Image}
              category={food.category}
              description={food.description}
              price={food.price}
              hide={food.hide}
            />
            {owner && (
              <div className="flex gap-2 pb-2 pl-2 justify-between pr-2 md:pr-0">
                <button
                  type="button"
                  className=" w-[50%] md:w-[25%] border-none outline-none bg-orange-500 p-1 rounded-lg text-lg text-white font-semibold"
                  onClick={() => navigate(`/Food/${food.id} `)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className=" w-[50%] md:w-[25%]  border-none outline-none bg-sky-700 p-1 rounded-lg text-lg text-white font-semibold"
                  onClick={() => navigate(`/Food/${food.id}/Ingredient`)}
                >
                  ingredient
                </button>
                <p className="ml-auto pr-1 md:pr-7 md:flex hidden">
                  Last updated on: {formattedDate}, {formattedTime}{" "}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      );
    }
    return null;
  });

  return (
    <section className={`w-full min-h-screen  ${classes.meals}`}>
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
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <h1 className=" font-bold text-5xl">
          {basketContext.restaurantBasket?.Name}
        </h1>
        <h3 className=" text-orange-300">
          Contact Number : {basketContext.restaurantBasket?.contactNumber}
        </h3>
      </div>
      <div className=" w-full flex items-center justify-center lg:justify-center gap-2 py-6 overflow-x-clip hover:overflow-x-scroll md:no-scrollbar">
        {categoryList &&
          categoryList.map((category) => (
            <div
              key={category.id}
              className={`group ${
                filter === category.param ? "bg-orange-400 " : "bg-slate-300"
              } w-24 min-w-[94px] h-20 cursor-pointer drop-shadow-xl
               hover:bg-orange-400 gap-3 items-center justify-center transition-all duration-150 ease-in-out roun`}
              onClick={() => setFilter(category.id)}
              onDoubleClick={() => modifyFood(category)}
            >
              <p
                className={`text-sm h-20 ${
                  filter === category.param ? "text-white " : " text-gray-800"
                } group-hover:text-white flex items-center justify-center`}
              >
                {category.name}
              </p>
            </div>
          ))}
        {owner && (
          <div
            key={"add"}
            className={`group ${
              filter === "add" ? "bg-orange-400 " : "bg-slate-300"
            } w-24 min-w-[94px] h-20 cursor-pointer drop-shadow-xl
              hover:bg-orange-400 gap-3 items-center justify-center transition-all duration-150 ease-in-out roun`}
            onClick={() => navigate("/Categories/Create")}
          >
            <p
              className={`text-sm h-20 ${
                filter === "add" ? "text-white " : " text-gray-800"
              } group-hover:text-white flex items-center justify-center`}
            >
              New...
            </p>
          </div>
        )}
      </div>

      <ul>{foodsList2}</ul>
    </section>
  );
};

export default AvailableFoods;
