// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "RECEIVED": "RECEIVED",
  "ACCEPTED": "ACCEPTED",
  "REJECTED": "REJECTED",
  "READY_FOR_PICKEDUP": "READY_FOR_PICKEDUP",
  "COMPLETED": "COMPLETED"
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
  OrderStatus
};