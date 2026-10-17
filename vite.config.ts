import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { mockSurveyApi } from './mocks/surveyApi.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockSurveyApi()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react-vendor', test: /node_modules\/(react|react-dom|scheduler)\// }],
        },
      },
    },
  },
})
