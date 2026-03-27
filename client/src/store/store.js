import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice'
import cartReducer from './cartProduct'
import addressSlice from './addressSlice'
export const store = configureStore({
  reducer: {
    user : userReducer,
    product:productReducer,
    cartItem:cartReducer,
    // product : productReducer,
    // cartItem : cartReducer,
    address : addressSlice,
    // orders : orderReducer
  },
})