import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { SurveySubmission } from '../types/survey'

type SubmissionResult = {
  id: string
}

export const surveyApi = createApi({
  reducerPath: 'surveyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    submitSurvey: builder.mutation<SubmissionResult, SurveySubmission>({
      query: (body) => ({ url: 'surveys', method: 'POST', body }),
    }),
  }),
})

export const { useSubmitSurveyMutation } = surveyApi
