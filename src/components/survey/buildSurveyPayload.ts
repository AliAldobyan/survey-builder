import type { SurveyAnswer, SurveyQuestion, SurveySettings, SurveySubmission } from '../../types/survey'

type SurveyDraft = {
  settings: SurveySettings
  questions: SurveyQuestion[]
  answers: Record<string, SurveyAnswer | undefined>
}

export function buildSurveyPayload({ settings, questions, answers }: SurveyDraft): SurveySubmission {
  const submittedAnswers: Record<string, SurveyAnswer> = {}

  // Include answers only for questions that are still in the survey.
  for (const question of questions) {
    const answer = answers[question.id]
    if (answer) submittedAnswers[question.id] = answer
  }

  // Create an independent snapshot without changing the Redux draft.
  return structuredClone({
    settings: { ...settings, title: settings.title.trim() },
    questions,
    answers: submittedAnswers,
  })
}
