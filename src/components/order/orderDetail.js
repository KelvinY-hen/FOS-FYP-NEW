import { Card, Descriptions, Divider, List, Button, Tag, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataStore } from "aws-amplify";
import {
  Order,
  OrderFood,
  OrderStatus,
  Foods,
  Ingredient,
  FoodIngredient,
  User,
  Type,
} from "../../models";
import { motion } from "framer-motion";
import { useCTX } from "../../context/Context";

const statusToColor = {
  [OrderStatus.RECEIVED]: "green",
  [OrderStatus.ACCEPTED]: "orange",
  [OrderStatus.REJECTED]: "red",
  [OrderStatus.READY_FOR_PICKEDUP]: "yellow",
  [OrderStatus.COMPLETED]: "purple",
};

const typeToColor = {
  [Type.DINEIN]: "green",
  [Type.PICKUP]: "blue",
};

const DetailedOrder = () => {
  const { id } = useParams();

  const [dbUser, setDBUser] = useState([]);
  const [order, setOrder] = useState("");
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    DataStore.query(Order, id).then(setOrder);
  }, [id]);

  useEffect(() => {
    DataStore.query(User, (u) => u.sub.eq(order.userID)).then((u) =>
      setDBUser(u[0])
    );
  }, [order?.userID]);

  useEffect(() => {
    if (!order?.id) {
      return;
    }
    const fetchData = async () => {
      const [oFood, tempFood] = await Promise.all([
        DataStore.query(OrderFood, (of) => of.orderID.eq(order.id)),
        DataStore.query(Foods, (of) => of.restaurantID.eq(order?.restaurantID)),
      ]);

      const updatedOrderedFoods = oFood.map((of) => ({
        ...of,
        name:
          tempFood.find((f) => f.id === of.foodsID)?.name || "Name Not Found",
        price: tempFood.find((f) => f.id === of.foodsID)?.price || 0,
      }));
      setDishes(updatedOrderedFoods);
    };

    fetchData();
  }, [order?.id]);

  const reduceIngredient = async () => {
    try {
      const [ingredients, foodIngredients] = await Promise.all([
        DataStore.query(Ingredient, (I) => I.restaurantID.eq(order?.restaurantID)),
        DataStore.query(FoodIngredient, (FI) => FI.restaurantID.eq(order?.restaurantID)),
      ]);

      for (const item of dishes) {

        const foodIngredientItems = foodIngredients.filter(
          (ing) => ing.foodsID === item.foodsID
        );

        if (!foodIngredientItems) {
          continue;
        }

        for (const foodIngredientItem of foodIngredientItems) {
          const ingredientItem = ingredients.find(
            (ing) => ing.id === foodIngredientItem.ingredientID
          );

          if (!ingredientItem) {
            continue;
          }

          const newQuantity =
            ingredientItem.quantity -
            foodIngredientItem.recipeQuantity * item.quantity;

          await DataStore.save(
            Ingredient.copyOf(ingredientItem, (updated) => {
              updated.quantity = newQuantity;
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const acceptOrder = async () => {
    await reduceIngredient();
    updateOrderStatus(OrderStatus.ACCEPTED);
  };

  const declineOrder = async () => {
    updateOrderStatus(OrderStatus.REJECTED);
  };

  const readyForPickup = async () => {
    updateOrderStatus(OrderStatus.READY_FOR_PICKEDUP);
  };

  const completeOrder = async () => {
    updateOrderStatus(OrderStatus.COMPLETED);
  };

  const updateOrderStatus = async (newStatus) => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = newStatus;
      })
    );
    setOrder(updatedOrder);
  };

  if (!order) {
    return <Spin size="large" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 15 }}
      className="w-full min-h-screen"
    >
      <Card title={`Order ${id}`} style={{ margin: 20 }}>
        <Tag color={statusToColor[order?.status]}>{order?.status}</Tag>
        <Tag color={typeToColor[order?.Type]}>{order?.Type}</Tag>
        <Descriptions bordered column={{ lg: 1, md: 1, sm: 1 }}>
          <Descriptions.Item label="Customer">{dbUser?.name}</Descriptions.Item>
          <Descriptions.Item label="Customer Contact">
            {dbUser?.contactNumber}
          </Descriptions.Item>
          {order?.table === "DINEIN" && (
            <Descriptions.Item label="Table Number">
              {order?.table}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Payment Method">
            {order?.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method">
            {order?.orderNote}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <List
          dataSource={dishes}
          renderItem={(dishItem) => (
            <List.Item>
              <div style={{ fontWeight: "bold" }}>
                {dishItem.name} x{dishItem.quantity}
              </div>
              <div>${dishItem.price}</div>
            </List.Item>
          )}
        />

        <Divider />
        <div style={styles.totalSumContainer}>
          <h2>Total:</h2>
          <h2 style={styles.totalPrice}>${order?.totalPrice?.toFixed(2)}</h2>
        </div>
        <Divider />
        {order.status === OrderStatus.RECEIVED && (
          <div style={styles.buttonsContainer}>
            <button
              className={` w-full px-8 py-3 mx-5 transition duration-500 rounded-lg bg-red-500 hover:bg-white text-white hover:text-red-500 ${styles.button}`}
              onClick={declineOrder}
            >
              Decline Order
            </button>
            <button
              className={` w-full px-8 py-3 mx-5 transition duration-500 rounded-lg bg-blue-500 hover:bg-white text-white hover:text-blue-500 ${styles.button}`}
              onClick={acceptOrder}
            >
              Accept Order
            </button>
          </div>
        )}
        {order.status === OrderStatus.ACCEPTED && (
          <button
            className={` w-full px-8 py-3 mx-5 transition duration-500 rounded-lg bg-blue-500 hover:bg-white text-white hover:text-blue-500 ${styles.button}`}
            onClick={readyForPickup}
          >
            Food is Done
          </button>
        )}
        {order.status === OrderStatus.READY_FOR_PICKEDUP && (
          <button
            className={` w-full px-8 py-3 mx-5 transition duration-500 rounded-lg bg-blue-500 hover:bg-white text-white hover:text-blue-500 ${styles.button}`}
            onClick={completeOrder}
          >
            Received by Customer
          </button>
        )}
      </Card>
    </motion.div>
  );
};

const styles = {
  totalSumContainer: {
    flexDirection: "row",
    display: "flex",
  },
  totalPrice: {
    marginLeft: "auto",
    fontWeight: "bold",
  },
  buttonsContainer: {
    display: "flex",
    paddingBottom: 30,
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
  },
};

export default DetailedOrder;
