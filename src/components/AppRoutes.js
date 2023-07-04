import React from 'react'
import { Routes, Route } from "react-router-dom"
import Menu from './food/Menu'
import CreateFood from './food/CRUD/CreateFood'
import UpdateFood from './food/CRUD/UpdateFood'
import Home from './restaurant/Home'
import Warehouse from './ingredient/Warehouse'
import CreateCategory from './food/CRUD/CreateCategory'
import UpdateCategory from './food/CRUD/UpdateCategory'
import CreateRestaurant from './restaurant/CreateRestaurant'
import UpdateRestaurant from './restaurant/UpdateRestaurant'
import CreateIngredient from './ingredient/CreateIngredient'
import UpdateIngredient from './ingredient/UpdateIngredient'
import CreateFoodIngredient from './ingredient/CreateFoodIngredient'
import OrdersList from './order/orderList'
import DetailedOrder from './order/orderDetail'
import UserOrdersList from './order/userOrderList'
import UserDetailedOrder from './order/userOrderDetail'


const AppRoutes =() => {
    return (
        <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/Restaurant/Create" element={<CreateRestaurant />} />
            <Route path="/Restaurant/:id" element={<Menu />} />
            <Route path="/Restaurant/Edit/:id" element={<UpdateRestaurant />} />
            <Route path="/Restaurant/Order" element={<OrdersList/>} />
            <Route path="/Restaurant/Order/:id" element={<DetailedOrder/>} />
            <Route path="/Order" element={<UserOrdersList/>} />
            <Route path="/Order/:id" element={<UserDetailedOrder/>} />
            <Route path="/Categories/Create" element={<CreateCategory/>} />
            <Route path="/Categories/:id" element={<UpdateCategory />} />
            <Route path="/Food/Create" element={<CreateFood />} />
            <Route path="/Food/:id" element={<UpdateFood />} />
            <Route path="/Food/:id/Ingredient" element={<CreateFoodIngredient />} />
            <Route path="/Ingredient" element={<Warehouse />} />
            <Route path="/Ingredient/Create" element={<CreateIngredient />} />
            <Route path="/Ingredient/Edit/:id" element={<UpdateIngredient />} />
        </Routes>
    )
}
export default AppRoutes;