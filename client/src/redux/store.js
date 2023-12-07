import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import clientReducer from './clients/clientSlice'
import categoryReducer from './categories/categorySlice'
import productReducer from './products/productSlice'
import saleReducer from './sales/salesSlice'

import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({ 
  user: userReducer,
  client: clientReducer,
  product: productReducer,
  category: categoryReducer,
  sale: saleReducer
})

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)