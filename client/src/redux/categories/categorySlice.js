import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: []
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    getCategories: (state, action) => {
      state.categories = action.payload
    },
    addCategory: (state, action) => {
        state.categories = [...state.categories, action.payload]
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload
      const index = state.categories.findIndex(category => category._id === updatedCategory._id)
      if (index !== -1) {
        state.categories[index] = updatedCategory
      }
    },
    deleteCategory: (state, action) => {
        state.categories =  state.categories.filter((category) => category._id !== action.payload)
    },
    clearCategories: (state) => {
      state.categories = []
    }
  },
})

export const {
  getCategories,
  addategory,
  updateategory,
  deleteategory, 
  clearCategories
} = categorySlice.actions

export default categorySlice.reducer