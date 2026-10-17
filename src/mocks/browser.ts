import { delay, http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { surveyTemplates } from '../../mocks/surveyTemplates'
import type { SurveySubmission } from '../types/survey'

const apiUrl = new URL(`${import.meta.env.BASE_URL}api/`, window.location.origin).href

export const worker = setupWorker(
  http.get(`${apiUrl}survey-templates`, async () => {
    await delay(600)
    return HttpResponse.json(surveyTemplates)
  }),
  http.post(`${apiUrl}surveys`, async ({ request }) => {
    try {
      const survey = await request.json() as SurveySubmission
      if (typeof survey?.settings?.title !== 'string' || !survey.settings.title.trim() ||
        !Array.isArray(survey.questions) || survey.questions.length === 0 ||
        !survey.answers || typeof survey.answers !== 'object' || Array.isArray(survey.answers)) {
        return HttpResponse.json({ message: 'Invalid survey payload' }, { status: 400 })
      }
      await delay(600)
      return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
    } catch {
      return HttpResponse.json({ message: 'Invalid JSON payload' }, { status: 400 })
    }
  }),
)
