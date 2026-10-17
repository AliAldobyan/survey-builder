import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { SurveySubmission, SurveyTemplate } from '../types/survey'

type SubmissionResult = {
  id: string
}

export const surveyApi = createApi({
  reducerPath: 'surveyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getSurveyTemplates: builder.query<SurveyTemplate[], void>({
      query: () => 'survey-templates',
    }),
    submitSurvey: builder.mutation<SubmissionResult, SurveySubmission>({
      query: (body) => ({ url: 'surveys', method: 'POST', body }),
    }),
  }),
})

export const { useSubmitSurveyMutation, useGetSurveyTemplatesQuery } = surveyApi
