import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  clients: []
}

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    getClients: (state, action) => {
      state.clients = action.payload
    },
    addClient: (state, action) => {
        state.clients = [...state.clients, action.payload]
    },
    deleteClient: (state, action) => {
        state.clients =  state.clients.filter((client) => client._id !== action.payload)
    },
  },
})

export const {
  getClients,
  addClient,
  deleteClient
} = clientSlice.actions

export default clientSlice.reducer