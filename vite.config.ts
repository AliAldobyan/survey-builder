import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { mockSurveyApi } from './mocks/surveyApi.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockSurveyApi()],
})
