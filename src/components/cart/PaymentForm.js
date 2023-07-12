import React from "react";
import {
  CardElement,
  useElements,
  Elements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CartContext from "../../context/Context";
import { useState, useContext } from "react";
import classes from "./PaymentForm.module.css";
import Modal from "../UI/Modal";
import OrderDelivered from "./OrderDelivered";

const stripeKey = loadStripe(
  "pk_test_51NDL7nC2FSMiNaQb6uFctw1DsZ998ri8tswOMPmPIChuF8y2jCoFv5TxhMj9p8U91GM93rdebs2d9RmythBeruV4003NMDb4ob"
);

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fb923c",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export const PaymentStripe = (props) => {
  return (
    <Elements stripe={stripeKey}>
      <PaymentForm onClose={props.onClose} />
    </Elements>
  );
};

const PaymentForm = (props) => {
  const { basketContext } = useContext(CartContext);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);

  const totalPrice = `${basketContext.totalPrice.toFixed(2) * 100}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    const succesSet = () => {
      setSuccess(true);
    };

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:4000/payment", {
          amount: totalPrice,
          id,
        });

        if (response.data.success) {
          console.log("succesful payment");
          await basketContext.createOrder();
          succesSet();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(error);
      setFields(true);
      setMsg("Failed Transaction");
      setAlertStatus("danger");
      setTimeout(() => {
        setFields(false);
      }, 4000);
    }
  };
  
  return (
    <Modal onClose={props.onClose}>
      {!success ? (
        <>
          {fields && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
                alertStatus === "danger"
                  ? "bg-red-400 text-red-800"
                  : "bg-emerald-400 text-emerald-800"
              }`}
            >
              {msg}
            </motion.p>
          )}
          <form onSubmit={handleSubmit}>
            <fieldset className=" FormGroup">
              <div className="FormRow">
                <label htmlFor="toggle-order">Card Number :</label>
                <CardElement id="card-element" options={CARD_OPTIONS} />
              </div>
            </fieldset>
            <div className={classes.actions}>
              <button
                className={classes["button--alt"]}
                onClick={props.onClose}
              >
                {" "}
                Close{" "}
              </button>
              <button className={classes["button"]}>Pay</button>
            </div>
          </form>
        </>
      ) : (
        <OrderDelivered onClose={props.onClose} />
      )}
    </Modal>
  );
};
