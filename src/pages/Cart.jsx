import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const totalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cart.cartItems.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Go Back</Link></p>
            ) : (
                <div>
                    {cart.cartItems.map(item => (
                        <div key={item._id} className="flex justify-between mb-2">
                            <div>{item.name}</div>
                            <div>${item.price} x {item.quantity}</div>
                            <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-500">Remove</button>
                        </div>
                    ))}
                    <h2 className="font-bold mt-4">Total: ${totalPrice}</h2>
                    <Link to="/checkout" className="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block">Proceed to Checkout</Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
