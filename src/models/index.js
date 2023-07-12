// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PaymentMethod = {
  "CASH": "CASH",
  "ONLINE": "ONLINE"
};

const Type = {
  "DINEIN": "DINEIN",
  "PICKUP": "PICKUP"
};

const OrderStatus = {
  "RECEIVED": "RECEIVED",
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED",
  "READY_FOR_PICKEDUP": "READY_FOR_PICKEDUP",
  "COMPLETED": "COMPLETED",
  "CANCELLED": "CANCELLED"
};

const { CartFood, OrderFood, Cart, Order, FoodIngredient, User, Restaurant, Payment, Ingredient, Categories, Foods } = initSchema(schema);

export {
  CartFood,
  OrderFood,
  Cart,
  Order,
  FoodIngredient,
  User,
  Restaurant,
  Payment,
  Ingredient,
  Categories,
  Foods,
  PaymentMethod,
  Type,
  OrderStatus
};