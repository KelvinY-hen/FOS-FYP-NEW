import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum Type {
  DINEIN = "DINEIN",
  PICKUP = "PICKUP"
}

export enum OrderStatus {
  RECEIVED = "RECEIVED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  READY_FOR_PICKEDUP = "READY_FOR_PICKEDUP",
  COMPLETED = "COMPLETED"
}



type EagerCartFood = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CartFood, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity: number;
  readonly cartID: string;
  readonly foodID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCartFood = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CartFood, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity: number;
  readonly cartID: string;
  readonly foodID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CartFood = LazyLoading extends LazyLoadingDisabled ? EagerCartFood : LazyCartFood

export declare const CartFood: (new (init: ModelInit<CartFood>) => CartFood) & {
  copyOf(source: CartFood, mutator: (draft: MutableModel<CartFood>) => MutableModel<CartFood> | void): CartFood;
}

type EagerOrderFood = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrderFood, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity: number;
  readonly orderID: string;
  readonly foodsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOrderFood = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<OrderFood, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly quantity: number;
  readonly orderID: string;
  readonly foodsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type OrderFood = LazyLoading extends LazyLoadingDisabled ? EagerOrderFood : LazyOrderFood

export declare const OrderFood: (new (init: ModelInit<OrderFood>) => OrderFood) & {
  copyOf(source: OrderFood, mutator: (draft: MutableModel<OrderFood>) => MutableModel<OrderFood> | void): OrderFood;
}

type EagerCart = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Cart, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID: string;
  readonly CartFoods?: (CartFood | null)[] | null;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCart = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Cart, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID: string;
  readonly CartFoods: AsyncCollection<CartFood>;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Cart = LazyLoading extends LazyLoadingDisabled ? EagerCart : LazyCart

export declare const Cart: (new (init: ModelInit<Cart>) => Cart) & {
  copyOf(source: Cart, mutator: (draft: MutableModel<Cart>) => MutableModel<Cart> | void): Cart;
}

type EagerOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly OrderFoods?: (OrderFood | null)[] | null;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly userID: string;
  readonly DateTime?: string | null;
  readonly totalPrice: number;
  readonly restaurantID: string;
  readonly table?: number | null;
  readonly Type?: Type | keyof typeof Type | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly OrderFoods: AsyncCollection<OrderFood>;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly userID: string;
  readonly DateTime?: string | null;
  readonly totalPrice: number;
  readonly restaurantID: string;
  readonly table?: number | null;
  readonly Type?: Type | keyof typeof Type | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Order = LazyLoading extends LazyLoadingDisabled ? EagerOrder : LazyOrder

export declare const Order: (new (init: ModelInit<Order>) => Order) & {
  copyOf(source: Order, mutator: (draft: MutableModel<Order>) => MutableModel<Order> | void): Order;
}

type EagerFoodIngredient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FoodIngredient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly recipeQuantity: number;
  readonly ingredientID: string;
  readonly foodsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFoodIngredient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<FoodIngredient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly recipeQuantity: number;
  readonly ingredientID: string;
  readonly foodsID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type FoodIngredient = LazyLoading extends LazyLoadingDisabled ? EagerFoodIngredient : LazyFoodIngredient

export declare const FoodIngredient: (new (init: ModelInit<FoodIngredient>) => FoodIngredient) & {
  copyOf(source: FoodIngredient, mutator: (draft: MutableModel<FoodIngredient>) => MutableModel<FoodIngredient> | void): FoodIngredient;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly contactNumber?: string | null;
  readonly sub: string;
  readonly Orders?: (Order | null)[] | null;
  readonly Carts?: (Cart | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly contactNumber?: string | null;
  readonly sub: string;
  readonly Orders: AsyncCollection<Order>;
  readonly Carts: AsyncCollection<Cart>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Categories?: (Categories | null)[] | null;
  readonly Payments?: Payment | null;
  readonly Ingredients?: (Ingredient | null)[] | null;
  readonly adminSub: string;
  readonly Foods?: (Foods | null)[] | null;
  readonly Carts?: (Cart | null)[] | null;
  readonly Orders?: (Order | null)[] | null;
  readonly contactNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly restaurantPaymentsId?: string | null;
}

type LazyRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name: string;
  readonly Categories: AsyncCollection<Categories>;
  readonly Payments: AsyncItem<Payment | undefined>;
  readonly Ingredients: AsyncCollection<Ingredient>;
  readonly adminSub: string;
  readonly Foods: AsyncCollection<Foods>;
  readonly Carts: AsyncCollection<Cart>;
  readonly Orders: AsyncCollection<Order>;
  readonly contactNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly restaurantPaymentsId?: string | null;
}

export declare type Restaurant = LazyLoading extends LazyLoadingDisabled ? EagerRestaurant : LazyRestaurant

export declare const Restaurant: (new (init: ModelInit<Restaurant>) => Restaurant) & {
  copyOf(source: Restaurant, mutator: (draft: MutableModel<Restaurant>) => MutableModel<Restaurant> | void): Restaurant;
}

type EagerPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Payment = LazyLoading extends LazyLoadingDisabled ? EagerPayment : LazyPayment

export declare const Payment: (new (init: ModelInit<Payment>) => Payment) & {
  copyOf(source: Payment, mutator: (draft: MutableModel<Payment>) => MutableModel<Payment> | void): Payment;
}

type EagerIngredient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Ingredient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly restaurantID: string;
  readonly FoodIngredients?: (FoodIngredient | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyIngredient = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Ingredient, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly restaurantID: string;
  readonly FoodIngredients: AsyncCollection<FoodIngredient>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Ingredient = LazyLoading extends LazyLoadingDisabled ? EagerIngredient : LazyIngredient

export declare const Ingredient: (new (init: ModelInit<Ingredient>) => Ingredient) & {
  copyOf(source: Ingredient, mutator: (draft: MutableModel<Ingredient>) => MutableModel<Ingredient> | void): Ingredient;
}

type EagerCategories = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Categories, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly param?: string | null;
  readonly Foods?: (Foods | null)[] | null;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCategories = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Categories, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly param?: string | null;
  readonly Foods: AsyncCollection<Foods>;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Categories = LazyLoading extends LazyLoadingDisabled ? EagerCategories : LazyCategories

export declare const Categories: (new (init: ModelInit<Categories>) => Categories) & {
  copyOf(source: Categories, mutator: (draft: MutableModel<Categories>) => MutableModel<Categories> | void): Categories;
}

type EagerFoods = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Foods, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly price: number;
  readonly categoriesID: string;
  readonly Image?: string | null;
  readonly FoodIngredients?: (FoodIngredient | null)[] | null;
  readonly restaurantID: string;
  readonly CartFoods?: (CartFood | null)[] | null;
  readonly OrderFoods?: (OrderFood | null)[] | null;
  readonly hide?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFoods = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Foods, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly price: number;
  readonly categoriesID: string;
  readonly Image?: string | null;
  readonly FoodIngredients: AsyncCollection<FoodIngredient>;
  readonly restaurantID: string;
  readonly CartFoods: AsyncCollection<CartFood>;
  readonly OrderFoods: AsyncCollection<OrderFood>;
  readonly hide?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Foods = LazyLoading extends LazyLoadingDisabled ? EagerFoods : LazyFoods

export declare const Foods: (new (init: ModelInit<Foods>) => Foods) & {
  copyOf(source: Foods, mutator: (draft: MutableModel<Foods>) => MutableModel<Foods> | void): Foods;
}