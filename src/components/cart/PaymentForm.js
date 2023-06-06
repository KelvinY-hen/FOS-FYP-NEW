import React from 'react'
import { CardElement, useElements, Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from "axios" 
import CartContext from '../../context/cart-context'
import { useState, useContext } from 'react'
import classes from "./PaymentForm.module.css";
import Modal from '../UI/Modal'
import OrderDelivered from './OrderDelivered'

const stripeKey = loadStripe("pk_test_51NDL7nC2FSMiNaQb6uFctw1DsZ998ri8tswOMPmPIChuF8y2jCoFv5TxhMj9p8U91GM93rdebs2d9RmythBeruV4003NMDb4ob"  )

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
      ":-webkit-autofill": { color: "#fce883"},
      "::placeholder" : {color: "#87bbfd"}
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
}

export const PaymentStripe = (props) => {
  return (
    <Elements stripe={stripeKey}>
      <PaymentForm onClose={props.onClose}/>
    </Elements>
  )
}

const PaymentForm = (props) => {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const cartCtx = useContext(CartContext);
  const totalPrice = `${cartCtx.totalPrice.toFixed(2) * 100}`;

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)
    })
  
    const succesSet = () => {
      setSuccess(true);
    }

  if(!error) {
    try {
      const {id} = paymentMethod
      const response = await axios.post("http://localhost:4000/payment", {
        amount: totalPrice,
        id
      })

      if (response.data.success) {
        console.log("succesful payment")
        succesSet();
      }
    }
    catch(error) {
      console.log("tempe2")
    }
  } else {
    console.log("tempe")  }


  }
  return (
    <Modal onClose={props.onClose}>
      {!success ? (
        <>
          <form onSubmit={handleSubmit}  >
            <fieldset className=' FormGroup'>
              <div className='FormRow'>
                <CardElement id="card-element" options={CARD_OPTIONS} />
              </div>
            </fieldset>
            <div className={classes.actions}>
              <button className={classes["button--alt"]} onClick={props.onClose}> Close </button>
              <button className={classes["button"]}>Pay</button>
            </div>
          </form>
        </>
      ) : (
          <OrderDelivered onClose={props.onClose}/>
      )}
    </Modal>
  )
}

