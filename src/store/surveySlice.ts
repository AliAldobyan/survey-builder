import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SurveyQuestion } from '../types/survey'

export type SurveySettings = {
  title: string
  description: string
  confirmationMessage: string
}

type SurveyState = {
  settings: SurveySettings
  questions: SurveyQuestion[]
}

const initialState: SurveyState = {
  settings: {
    title: '',
    description: '',
    confirmationMessage: '',
  },
  questions: [],
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SurveySettings>>) {
      Object.assign(state.settings, action.payload)
    },
    addQuestion(state, action: PayloadAction<SurveyQuestion>) {
      if (!state.questions.some((question) => question.id === action.payload.id)) {
        state.questions.push(action.payload)
      }
    },
    updateQuestion(state, action: PayloadAction<SurveyQuestion>) {
      const index = state.questions.findIndex((question) => question.id === action.payload.id)
      if (index !== -1) {
        // Replace the complete question to keep its type-specific fields consistent.
        state.questions[index] = action.payload
      }
    },
    removeQuestion(state, action: PayloadAction<string>) {
      state.questions = state.questions.filter((question) => question.id !== action.payload)
    },
    moveQuestion(state, action: PayloadAction<{ id: string; toIndex: number }>) {
      const { id, toIndex } = action.payload
      const fromIndex = state.questions.findIndex((question) => question.id === id)
      if (fromIndex === -1 || !Number.isInteger(toIndex) || toIndex < 0 || toIndex >= state.questions.length) {
        return
      }

      const [question] = state.questions.splice(fromIndex, 1)
      state.questions.splice(toIndex, 0, question)
    },
  },
})

export const { updateSettings, addQuestion, updateQuestion, removeQuestion, moveQuestion } = surveySlice.actions
export default surveySlice.reducer
