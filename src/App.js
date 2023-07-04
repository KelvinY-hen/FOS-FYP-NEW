import React from "react";
import { Header, MainContainer } from "./components";
import AppRoutes from "./components/AppRoutes";
import { AnimatePresence } from "framer-motion";
import Menu from "./components/food/Menu";
import ContextProvider from "./context/ContextProvider";
import Cart from "./components/cart/Cart";
import { useState } from "react";
import { API, Amplify, Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

const App = () => {
  Amplify.configure(awsconfig);
  Auth.configure(awsconfig);
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  try {
    return (
      <Authenticator>
        <ContextProvider>
          {cartIsShown && <Cart onClose={hideCartHandler} />}
          <AnimatePresence mode="wait">
            <div className="w-screen h-auto flex flex-col bg-gray-100">
              <Header onShowCart={showCartHandler} onClose={hideCartHandler} />
              <main className="mt-16 md:mt-20 p-8 w-full">
                  <AppRoutes />
              </main>
            </div>
          </AnimatePresence>
        </ContextProvider>
      </Authenticator>
    );
  } catch (error) {
    console.error("An error occurred:", error);
    // You can provide fallback UI or error message here
    return <div>Error occurred. Please try again later.</div>;
  }
};

export default App;
