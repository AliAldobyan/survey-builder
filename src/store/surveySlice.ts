import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SurveySettings = {
  title: string
  description: string
  confirmationMessage: string
}

type SurveyState = {
  settings: SurveySettings
}

const initialState: SurveyState = {
  settings: {
    title: '',
    description: '',
    confirmationMessage: '',
  },
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SurveySettings>>) {
      Object.assign(state.settings, action.payload)
    },
  },
})

export const { updateSettings } = surveySlice.actions
export default surveySlice.reducer
