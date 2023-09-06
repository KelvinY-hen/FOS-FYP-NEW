import React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./Header";
import Cart from "./cart/Cart";
import Menu from "./food/Menu";
import CreateFood from "./food/CRUD/CreateFood";
import UpdateFood from "./food/CRUD/UpdateFood";
import Home from "./restaurant/Home";
import Warehouse from "./ingredient/Warehouse";
import CreateCategory from "./food/CRUD/CreateCategory";
import UpdateCategory from "./food/CRUD/UpdateCategory";
import CreateRestaurant from "./restaurant/CreateRestaurant";
import UpdateRestaurant from "./restaurant/UpdateRestaurant";
import CreateIngredient from "./ingredient/CreateIngredient";
import UpdateIngredient from "./ingredient/UpdateIngredient";
import CreateFoodIngredient from "./ingredient/CreateFoodIngredient";
import OrdersList from "./order/orderList";
import DetailedOrder from "./order/orderDetail";
import UserOrdersList from "./order/userOrderList";
import UserDetailedOrder from "./order/userOrderDetail";
import UpdateUser from "./user/UpdateUser";
import Footer from "./Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };
  return (
    <Router>
      <ScrollToTop />
      {cartIsShown && <Cart onClose={hideCartHandler} />}
      <div className="w-screen h-auto flex flex-col bg-gray-100">
        <Header onShowCart={showCartHandler} onClose={hideCartHandler} />
        <main className="mt-16 md:mt-20 md:p-8 p-4 w-full">
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/User/Edit" element={<UpdateUser />} />
            <Route path="/Restaurant/Create" element={<CreateRestaurant />} />
            <Route path="/Restaurant/:id" element={<Menu />} />
            <Route path="/Restaurant/Edit/:id" element={<UpdateRestaurant />} />
            <Route path="/Restaurant/Order" element={<OrdersList />} />
            <Route path="/Restaurant/Order/:id" element={<DetailedOrder />} />
            <Route path="/Order" element={<UserOrdersList />} />
            <Route path="/Order/:id" element={<UserDetailedOrder />} />
            <Route path="/Categories/Create" element={<CreateCategory />} />
            <Route path="/Categories/:id" element={<UpdateCategory />} />
            <Route path="/Food/Create" element={<CreateFood />} />
            <Route path="/Food/:id" element={<UpdateFood />} />
            <Route
              path="/Food/:id/Ingredient"
              element={<CreateFoodIngredient />}
            />
            <Route path="/Ingredient" element={<Warehouse />} />
            <Route path="/Ingredient/Create" element={<CreateIngredient />} />
            <Route path="/Ingredient/Edit/:id" element={<UpdateIngredient />} />
          </Routes>
        </main>
        <Footer/>
        <div className="bg-white p-0.5">

        </div>
        <div className=" bg-orange-600 items-center ">
          <p className="text-center p-4">Copyright ©2023, Designed by Kelvin Yeliandi</p>
        </div>
      </div>
    </Router>
  );
};
export default AppRoutes;
