import React from 'react';
import "../index.css";
import {BsCart, BsFillCartFill} from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useStateValue } from '../context/stateProvider';
import { actionType } from '../context/reducer';
import { useContext } from 'react';
import CartContext from '../context/cart-context';


const Header = (props) => {
  const cartCtx = useContext(CartContext);

  const { items } = cartCtx;

  const numberOfCartItems = items.reduce((curNumber, item) => {
    return curNumber + item.amount;
  }, 0);

  return (
    
        <header className='fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-orange-400 opacity-70 border-radius:6px'>
            {/*desktop*/}
            <div className='hidden md:flex w-full h-full p-4'>
              <div className='flex items-center gap-2'>
              
              </div>

              <div className='flex items-center gap-8 ml-auto  '>
                <ul className='flex items-center gap-8 opacity-100'>
                  <li className='text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer'>Home</li>
                  <li className='text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer'>About Us</li>
                  <li className='text-base hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer'>Join Us!</li>
                </ul>

                <div className='relative flext item-center justify-center'>
                  <BsCart className=' hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer ' onClick={props.onShowCart}/>
                  <div className='absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center'>
                    <p className=' text-xs text-white font-semibold'>{numberOfCartItems}</p>
                  </div>
                </div>
              </div>
              
            </div>


            {/*mobile*/}
            <div className='flex md:hidden items-center justify-between w-full h-full '>
              <div className='relative flext items-end ml-auto justify-center'>
                  <BsCart className=' hover:text-black text-gray-500 duration-100 transition-all ease-in-out cursor-pointer' onClick={props.onShowCart}/>
                  <div className='absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center'>
                    <p className=' text-xs text-white font-semibold'>{numberOfCartItems}</p>
                  </div>
                </div>
            </div>

            
        </header>
  )
};

export default Header