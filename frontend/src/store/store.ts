import { configureStore } from '@reduxjs/toolkit'
import mapReducer from '../features/mapSlice'
import appReducer from '../features/appSlice'

const store = configureStore({
  reducer: {
    map: mapReducer,
    app: appReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
