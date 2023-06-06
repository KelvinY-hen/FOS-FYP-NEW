import classes from "./AvailableFoods.module.css";
import Card from "../UI/Card";
import FoodItems from "./FoodItems";
import { useEffect, useState } from "react";

const DUMMY_FoodS = [
  {
    id: "m1",
    name: "Hamburger",
    category: "Meat",
    description: "The Classic Burger",
    price: 22.99,
  },
  {
    id: "m2",
    name: "Fried chicken",
    category: "Meat",
    description: "Special crispy chicken.",
    price: 16.5,
  },
  {
    id: "m3",
    name: "Barbecue Burger",
    category: "Meat",
    description: "American, raw, meaty",
    price: 12.99,
  },
  {
    id: "dt1",
    name: "Special Cheese Cake",
    category: "Dessert",
    description: "Chessy yet sweet",
    price: 15.99,
  },
  {
    id: "v1",
    name: "Green Bowl",
    category: "Vegetables",
    description: "Healthy...and green...",
    price: 18.99,
  },
  {
    id: "dr1",
    name: "Pepsi",
    category: "Drink",
    description: "Bepsi is the best",
    price: 3.99,
  },
];

const DUMMY_Categories = [
  {
    id: "m",
    name:"Meat",
    param: 'Meat'
  },
  {
    id: "v",
    name:"Vegetables",
    param:"Vegetables"
  },
  {
    id: "dt",
    name:"Dessert",
    param:"Dessert"
  },
  {
    id:"dr",
    name:"Drink",
    param:"Drink"
  }
];


const AvailableFoods = () => {
  const [filter,setFilter] = useState("Meat")
  useEffect(() => {}, [filter])
  

  const foodsList = DUMMY_FoodS.map((food) => (
    <Card>
      <FoodItems
        id={food.id}
        key={food.id}
        name={food.name}
        category={food.category}
        description={food.description}
        price={food.price}
      />
    </Card>
  ));

  const foodsList2 = DUMMY_FoodS.map((food) => {
    if (filter === food.category) {
      return (
        <Card>
          <FoodItems
            id={food.id}
            key={food.id}
            name={food.name}
            category={food.category}
            description={food.description}
            price={food.price}
          />
        </Card>
      );
    }
    return null;
  });

  // return (
  //   <section className={classes.meals}>
  //     <Card>
  //       <ul>{foodsList}</ul>
  //     </Card>
  //   </section>

  return (
    <section className={classes.meals}>
      
        <div className=" w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scroll-none">
          {DUMMY_Categories && DUMMY_Categories.map((category) => (
            
            <div key={category.id} className= {`group ${filter === category.param ? "bg-orange-400 ": "bg-slate-300"} w-24 min-w-[94px] h-28 cursor-pointer drop-shadow-xl
               hover:bg-orange-400 gap-3 items-center justify-center transition-all duration-150 ease-in-out`} onClick={() => setFilter(category.param)}>
              <p className={`text-sm h-32 ${filter === category.param ? "text-white ": " text-gray-800"} group-hover:text-white flex items-center justify-center`}>
                {category.name} tempe
              </p>
            </div>
            ))}
        </div>
      
        <ul>{foodsList2}</ul>
    </section>
  );
};

export default AvailableFoods;
