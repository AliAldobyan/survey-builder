import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AttachmentMetadata, SurveyAnswer, SurveyQuestion, SurveySettings } from '../types/survey'

export type { SurveySettings } from '../types/survey'

type SurveyState = {
  settings: SurveySettings
  questions: SurveyQuestion[]
  answers: Record<string, SurveyAnswer | undefined>
}

const initialState: SurveyState = {
  settings: {
    title: '',
    description: '',
    confirmationMessage: '',
  },
  questions: [],
  answers: {},
}

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    replaceQuestions(state, action: PayloadAction<SurveyQuestion[]>) {
      state.questions = action.payload
      state.answers = {}
    },
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
        // Answers from the old type cannot be reused after a type change.
        if (state.questions[index].type !== action.payload.type) {
          delete state.answers[action.payload.id]
        } else if ('options' in action.payload) {
          // Keep selections only while their option IDs still exist.
          const optionIds = new Set(action.payload.options.map((option) => option.id))
          const answer = state.answers[action.payload.id]
          if (answer?.type === 'MC') {
            answer.optionIds = answer.optionIds.filter((id) => optionIds.has(id))
          } else if (answer && (answer.type === 'RADIO' || answer.type === 'DDL')) {
            if (!optionIds.has(answer.optionId)) delete state.answers[action.payload.id]
          }
        }
        // Replace the complete question to keep its type-specific fields consistent.
        state.questions[index] = action.payload
      }
    },
    removeQuestion(state, action: PayloadAction<string>) {
      state.questions = state.questions.filter((question) => question.id !== action.payload)
      delete state.answers[action.payload]
    },
    setTextAnswer(state, action: PayloadAction<{ questionId: string; value: string }>) {
      const { questionId, value } = action.payload
      const question = state.questions.find((item) => item.id === questionId)
      if (question?.type === 'TEXT') {
        state.answers[questionId] = { type: 'TEXT', value }
      }
    },
    setSingleChoiceAnswer(state, action: PayloadAction<{ questionId: string; optionId: string }>) {
      const { questionId, optionId } = action.payload
      const question = state.questions.find((item) => item.id === questionId)
      if (question?.type !== 'RADIO' && question?.type !== 'DDL') return
      if (optionId === '') {
        delete state.answers[questionId]
      } else if (question.options.some((option) => option.id === optionId)) {
        state.answers[questionId] = { type: question.type, optionId }
      }
    },
    setMultipleChoiceAnswer(state, action: PayloadAction<{ questionId: string; optionIds: string[] }>) {
      const { questionId, optionIds } = action.payload
      const question = state.questions.find((item) => item.id === questionId)
      if (question?.type !== 'MC') return
      const allowedIds = new Set(question.options.map((option) => option.id))
      state.answers[questionId] = {
        type: 'MC',
        optionIds: [...new Set(optionIds)].filter((id) => allowedIds.has(id)),
      }
    },
    setAttachmentAnswer(state, action: PayloadAction<{ questionId: string; file: AttachmentMetadata | null }>) {
      const { questionId, file } = action.payload
      const question = state.questions.find((item) => item.id === questionId)
      if (question?.type !== 'ATTACHMENT') return
      if (file) state.answers[questionId] = { type: 'ATTACHMENT', file }
      else delete state.answers[questionId]
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

export const {
  replaceQuestions, updateSettings, addQuestion, updateQuestion, removeQuestion, moveQuestion,
  setTextAnswer, setSingleChoiceAnswer, setMultipleChoiceAnswer, setAttachmentAnswer,
} = surveySlice.actions
export default surveySlice.reducer
