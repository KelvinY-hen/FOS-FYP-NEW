import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import CartContext from "../../context/cart-context";
import OrderDelivered from "./OrderDelivered";
import { PaymentStripe } from "./PaymentForm";




const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  
  const [showOrder, setShowOrder] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalPrice = `$${cartCtx.totalPrice.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartRemove = (id) => {
    cartCtx.removeItem(id);
  };

  const cartAdd = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const succesSet = () => {
    setSuccess(true);
  }

  const orderHanlder = () => {
    setShowOrder(true);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartRemove.bind(null, item.id)}
          onAdd={cartAdd.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <Modal onClose={props.onClose}>
      {!showOrder ? (
        <>
          {cartItems}
          <div className={classes.total}>
            <span>Total Price</span>
            <span>{totalPrice}</span>
          </div>
          <div className={classes.actions}>
            <button className={classes["button--alt"]} onClick={props.onClose}>
              Close
            </button>
            {hasItems && (
              <button className={classes.button} onClick={orderHanlder}>
                Order
              </button>
            )}
          </div>
        </>
      ) : (
          <PaymentStripe onClose={props.onClose}/>
      )}
    </Modal>
  );
};

export default Cart;
