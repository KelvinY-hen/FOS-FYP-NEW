import React from "react";
import { useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import { Restaurant } from "../../models";
import RestaurantItems from "./RestaurantItems";
import Card from "../UI/Card";
import { motion } from "framer-motion";

function Home() {
  const [restaurantList, setRestaurant] = useState([]);

  useEffect(() => {
    DataStore.query(Restaurant).then(setRestaurant);
  }, []);

  const variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  const restaurants = restaurantList.map((restaurant) => {
    return (
      <Card>
        <RestaurantItems
          id={restaurant.id}
          name={restaurant.Name}
          rating={restaurant.Rating}
        />
      </Card>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, translateY:15}}
      animate={{ opacity: 1, translateY:0}}
      exit={{ opacity: 0, translateY:15}}
      transition={{ duration: 1 }}
      className="w-full min-h-screen"
    >
      {restaurants}
    </motion.div>
  );
}

export default Home;
