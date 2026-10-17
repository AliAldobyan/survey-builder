import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

function sendJson(response: ServerResponse, status: number, data: object) {
  response.writeHead(status, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(data))
}

async function handleSurveyRequest(request: IncomingMessage, response: ServerResponse, next: () => void) {
  // Let Vite handle requests that are not for this endpoint.
  if (request.url?.split('?')[0] !== '/api/surveys') return next()
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { message: 'Use POST to submit a survey' })
  }

  try {
    // Request data arrives in chunks. Combine them before reading the JSON.
    let body = ''
    for await (const chunk of request) {
      body += chunk
      if (Buffer.byteLength(body) > 1024 * 1024) {
        return sendJson(response, 413, { message: 'Payload too large' })
      }
    }

    const survey = JSON.parse(body)
    const hasTitle = typeof survey?.settings?.title === 'string' && survey.settings.title.trim()
    const hasQuestions = Array.isArray(survey?.questions) && survey.questions.length > 0
    const hasAnswers = survey?.answers && typeof survey.answers === 'object' && !Array.isArray(survey.answers)

    if (!hasTitle || !hasQuestions || !hasAnswers) {
      return sendJson(response, 400, { message: 'Invalid survey payload' })
    }

    // Pretend to save the survey. No data is actually stored.
    await new Promise((resolve) => setTimeout(resolve, 600))
    sendJson(response, 201, { id: randomUUID() })
  } catch {
    sendJson(response, 400, { message: 'Invalid JSON payload' })
  }
}

export function mockSurveyApi(): Plugin {
  return {
    name: 'mock-survey-api',
    configureServer(server) { server.middlewares.use(handleSurveyRequest) },
    configurePreviewServer(server) { server.middlewares.use(handleSurveyRequest) },
  }
}
