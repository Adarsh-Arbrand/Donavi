import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axios';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const handleCheckout = async () => {
        const items = cart.cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }));
        const { data } = await axios.post('/orders', { orderItems: items, totalPrice: items.reduce((a, i) => a + i.price * i.quantity, 0) });
        alert('Order placed successfully!');
        dispatch(clearCart());
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <button onClick={handleCheckout} className="bg-green-500 text-white px-4 py-2 rounded">Place Order</button>
        </div>
    );
};

export default Checkout;
