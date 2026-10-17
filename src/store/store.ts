import { configureStore } from '@reduxjs/toolkit'
import { surveyApi } from '../services/surveyApi'
import surveyReducer from './surveySlice'

export const store = configureStore({
  reducer: {
    survey: surveyReducer,
    [surveyApi.reducerPath]: surveyApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(surveyApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
