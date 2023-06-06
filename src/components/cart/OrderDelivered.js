import { Fragment } from "react";
import classes from "./Cart.module.css";
import { useContext } from "react";
import CartContext from "../../context/cart-context";
import { clear } from "@testing-library/user-event/dist/clear";

const OrderDelivered = (props) => {
  const cartCtx = useContext(CartContext);
  const clearall = () => {
    cartCtx.clearall();
  };

  return (
    <Fragment>
      <section>
        <h2>Thank you so much for your order!</h2>
        <p>We really appreciate it. </p>
        <p>
          Enjoy <b>10%</b> off your next purchase with this coupon code:
          <b>THANKYOU10.</b>
        </p>
      </section>
      <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={() => {props.onClose(); clearall();}}>
          Close
        </button>
      </div>
    </Fragment>
  );
};

export default OrderDelivered;
