import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { StateProvider } from "./context/stateProvider";
import { initialState, defaultCartState } from "./context/initialState";
import reducer from "./context/reducer";
import { AnimatePresence } from "framer-motion";

ReactDOM.render(
  <AnimatePresence mode="wait">
    <Router>
      <StateProvider initialState={defaultCartState} reducer={reducer}>
        <App />
      </StateProvider>
    </Router>{" "}
  </AnimatePresence>,
  document.getElementById("root")
);
