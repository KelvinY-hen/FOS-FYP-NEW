import React from "react";
import "../index.css";
import { BsCart, BsFillCartFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/stateProvider";
import { actionType } from "../context/reducer";
import { useContext, useState } from "react";
import { useCTX } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { motion } from "framer-motion";

const Header = (props) => {
  const { cartContext, restaurant, basketContext } = useCTX();

  const navigate = useNavigate();

  const NavigatePages = (name) => {
    return navigate(name);
  };

  const { items } = cartContext;

  const [isMenu, setIsMenu] = useState(false);

  // const numberOfCartItems = items.reduce((curNumber, item) => {
  //   return curNumber + item.amount;
  // }, 0);

  const numberOfBasketItems = basketContext.basketDishes.length;

  async function signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const login = async () => {
    setIsMenu(!isMenu);
  };

  return (
    <header className="fixed z-50 w-screen p-7 px-4 md:p-5 md:px-16 bg-orange-400  border-radius:6px">
      {/*desktop*/}
      <div className="hidden md:flex w-full h-full p-4">
        <div className="flex items-center gap-2"></div>

        <div className="flex items-center gap-8 ml-auto  ">
          <ul className="flex items-center gap-8 opacity-100"></ul>

          <motion.ul
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="flex items-center gap-8 "
          >
            <motion.li
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.5 }}
              className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
              onClick={() => NavigatePages("/")}
            >
              Home
            </motion.li>
            {restaurant && (
              <>
                <motion.li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
                  onClick={() => NavigatePages("Food/Create")}
                >
                  New Food{" "}
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
                  onClick={() => NavigatePages("Ingredient")}
                >
                  Warehouse{" "}
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
                  onClick={() => NavigatePages("/Restaurant/Edit/:id")}
                >
                  Update Restaurant{" "}
                </motion.li>
                <motion.li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
                  onClick={() => NavigatePages("/Restaurant/Order")}
                >
                  View Your Restaurant Order{" "}
                </motion.li>
              </>
            )}
            {!restaurant && (
              <>
                <motion.li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
                  onClick={() => NavigatePages("Restaurant/Create")}
                >
                  Join Us
                </motion.li>
              </>
            )}
            <motion.li
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.5 }}
              className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
              onClick={() => NavigatePages("User/Edit")}
            >
              Update Profile{" "}
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.5 }}
              className="text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer"
              onClick={() => NavigatePages("/Order")}
            >
              View Your Order{" "}
            </motion.li>
          </motion.ul>

          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.5 }}
            onClick={props.onShowCart}
            className="relative flext item-center justify-center"
          >
            <BsCart className=" hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer text-2xl " />
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 p-2   flex items-center justify-center">
              <p className=" text-xs text-white font-semibold p-3">
                {numberOfBasketItems}
              </p>
            </div>
          </motion.div>

          <div className="relative flext item-center justify-center">
            <CgProfile
              className=" hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer drop-shadow-2xl text-3xl"
              onClick={login}
            />
            {isMenu && (
              <div className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-8 right-0">
                <p
                  className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base"
                  onClick={signOut}
                >
                  Logout <MdLogout />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*mobile*/}
      <div className="flex md:hidden items-center justify-between w-full h-full ">
        <div className="relative flext items-end ml-auto mr-7 justify-center">
          <BsCart
            className=" hover:text-black text-gray-500 text-2xl duration-100 transition-all ease-in-out cursor-pointer"
            onClick={props.onShowCart}
          />
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <p className=" text-xs text-white font-semibold">
              {numberOfBasketItems}
            </p>
          </div>
        </div>
        <div className="relative flext item-center justify-center">
          <CgProfile
            className=" hover:text-black text-gray-500 duration-100 text-3xl transition-all ease-in-out cursor-pointer drop-shadow-2xl"
            onClick={login}
          />
          {isMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0 opacity-100"
            >
              <ul className="flex flex-col">
                <li
                  className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                  onClick={() => NavigatePages("/")}
                >
                  Home
                </li>
                {restaurant && (
                  <>
                    <li
                      className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                      onClick={() => NavigatePages("Food/Create")}
                    >
                      New Food{" "}
                    </li>
                    <li
                      className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                      onClick={() => NavigatePages("Ingredient")}
                    >
                      Manage Warehouse{" "}
                    </li>
                    <li
                      className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                      onClick={() => NavigatePages("/Restaurant/Edit/:id")}
                    >
                      Update Restaurant{" "}
                    </li>
                    <li
                      className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                      onClick={() => NavigatePages("/Restaurant/Order")}
                    >
                      View Your Restaurant Order{" "}
                    </li>
                  </>
                )}
                {!restaurant && (
                  <>
                    <li
                      className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                      onClick={() => NavigatePages("Restaurant/Create")}
                    >
                      Join Us
                    </li>
                  </>
                )}
                <li
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.5 }}
                  className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                  onClick={() => NavigatePages("User/Edit")}
                >
                  Update Profile{" "}
                </li>
                <li
                  className="text-base text-textColor hover:text-headingColor duration-100 transition-all ease-in-out cursor-pointer hover:bg-slate-100 px-4 py-2"
                  onClick={() => NavigatePages("/Order")}
                >
                  View Your Order{" "}
                </li>
              </ul>
              <p
                className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base"
                onClick={signOut}
              >
                Logout <MdLogout />
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
