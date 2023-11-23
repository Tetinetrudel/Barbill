import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: []
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload
    },
    addProduct: (state, action) => {
        state.products = [...state.products, action.payload]
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload
      const index = state.products.findIndex(product => product._id === updatedProduct._id)
      if (index !== -1) {
        state.products[index] = updatedProduct
      }
    },
    deleteProduct: (state, action) => {
        state.products =  state.products.filter((product) => product._id !== action.payload)
    },
    clearProducts: (state) => {
      state.products = []
    }
  },
})

export const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  clearProducts
} = productSlice.actions

export default productSlice.reducer