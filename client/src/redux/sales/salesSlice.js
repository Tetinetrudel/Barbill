import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dailySales: [],
  totalPrice: 0
}

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addDailySales: (state, action) => {
      const product = action.payload
      state.dailySales = [...state.dailySales, product]
      state.totalPrice += product.price
    },
    //updateProduct: (state, action) => {
    //  const updatedProduct = action.payload
    //  const index = state.dailySales.findIndex(product => product._id === updatedProduct._id)
    //  if (index !== -1) {
    //    state.dailySales[index] = updatedProduct
    //  }
    //},
    deleteDailySales: (state, action) => {
        const productId = action.payload
        const productIndex = state.dailySales.findIndex((invoice) => invoice._id === productId)
    
        if (productIndex !== -1) {
        const removedProduct = state.dailySales[productIndex]
            if (removedProduct.count > 1) {
                removedProduct.count--
            } else {
                state.dailySales.splice(productIndex, 1)
            }
            state.totalPrice -= removedProduct.price
        }
    },
    removeAllDailySales: (state, action) => {
        const productIdToRemove = action.payload
        const productsToRemove = state.dailySales.filter(product => product._id === productIdToRemove)
      
        if (productsToRemove.length > 0) {
          const totalPriceChange = productsToRemove.reduce((total, product) => total + product.price, 0)
      
          state.dailySales = state.dailySales.filter(product => product._id !== productIdToRemove)
          state.totalPrice -= totalPriceChange
        }
    },
    clearDailySales: (state) => {
      state.dailySales = []
      state.totalPrice = 0
    }
  },
})

export const {
  addDailySales,
  //updateDailySales,
  removeAllDailySales,
  deleteDailySales,
  clearDailySales
} = saleSlice.actions

export default saleSlice.reducer