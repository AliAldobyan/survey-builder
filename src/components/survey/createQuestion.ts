import type { QuestionType, SurveyQuestion } from '../../types/survey'

export function createQuestion(type: QuestionType): SurveyQuestion {
  const base = { id: crypto.randomUUID(), label: '', required: false }

  // Each question type starts with only the fields it needs.
  switch (type) {
    case 'MC':
    case 'DDL':
    case 'RADIO':
      return { ...base, type, options: [] }
    case 'TEXT':
      return { ...base, type, multiline: false }
    case 'ATTACHMENT':
      return { ...base, type }
  }
}
