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
    updateClient: (state, action) => {
      const updatedClient = action.payload
      const index = state.clients.findIndex(client => client._id === updatedClient._id)
      if (index !== -1) {
        state.clients[index] = updatedClient
      }
    },
    deleteClient: (state, action) => {
        state.clients =  state.clients.filter((client) => client._id !== action.payload)
    },
    clearClients: (state) => {
      state.clients = []
    }
  },
})

export const {
  getClients,
  addClient,
  updateClient,
  deleteClient,
  clearClients
} = clientSlice.actions

export default clientSlice.reducer