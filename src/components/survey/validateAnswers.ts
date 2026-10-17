import type { SurveyAnswer, SurveyQuestion } from '../../types/survey'
import { validateFile } from './attachments/fileValidation'

export type AnswerErrors = Record<string, 'required'>

export function validateAnswers(
  questions: SurveyQuestion[],
  answers: Record<string, SurveyAnswer | undefined>,
  files: ReadonlyMap<string, File>,
): AnswerErrors {
  const errors: AnswerErrors = {}

  for (const question of questions) {
    if (!question.required) continue
    const answer = answers[question.id]
    let valid = false

    switch (question.type) {
      case 'TEXT':
        valid = answer?.type === 'TEXT' && answer.value.trim().length > 0
        break
      case 'RADIO':
      case 'DDL':
        valid = answer?.type === question.type && question.options.some((option) => option.id === answer.optionId)
        break
      case 'MC': {
        const allowedIds = new Set(question.options.map((option) => option.id))
        valid = answer?.type === 'MC' && answer.optionIds.length > 0 && answer.optionIds.every((id) => allowedIds.has(id))
        break
      }
      case 'ATTACHMENT': {
        const file = answer?.type === 'ATTACHMENT' ? files.get(answer.file.id) : undefined
        valid = !!file && validateFile(file) === null
        break
      }
    }

    if (!valid) errors[question.id] = 'required'
  }

  return errors
}
