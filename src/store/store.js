import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import productsSlice from './slices/productsSlice';
import ordersSlice from './slices/ordersSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: productsSlice,
    orders: ordersSlice,
    admin: adminSlice,
  },
});