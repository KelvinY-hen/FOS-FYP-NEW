import React from 'react'
import { Header, MainContainer, CreateContainer } from './components'
import { Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Menu from './components/Meals/Menu'
import CartProvider from './context/CartProvider'
import Cart from './components/cart/Cart'
import { useState } from 'react'

const App = () => {

  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  return (
    <CartProvider>
       {cartIsShown && <Cart onClose={hideCartHandler} />}
      <AnimatePresence>
      <div className="w-screen h-auto flex flex-col bg-gray-100">
        <Header  onShowCart={showCartHandler} onClose={hideCartHandler} />

        <main className='mt-16 md:mt-20 p-8 w-full'>
          <Routes>
            <Route path="/*" element={<MainContainer />} />
            <Route path="/createItem" element={<CreateContainer />} />
          </Routes>
          <Menu/>
        </main>
      </div>
      </AnimatePresence>
    </CartProvider>
  )
}

export default App