export type QuestionOption = {
  id: string
  label: string
}

type BaseQuestion = {
  id: string
  label: string
  required: boolean
}

type ChoiceQuestion = BaseQuestion & {
  type: 'MC' | 'DDL' | 'RADIO'
  options: QuestionOption[]
}

type TextQuestion = BaseQuestion & {
  type: 'TEXT'
  multiline: boolean
  placeholder?: string
}

type AttachmentQuestion = BaseQuestion & {
  type: 'ATTACHMENT'
}

// The type determines which additional fields a question needs.
export type SurveyQuestion = ChoiceQuestion | TextQuestion | AttachmentQuestion

export type QuestionType = SurveyQuestion['type']

export type AttachmentMetadata = {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
}

export type SurveyAnswer =
  | { type: 'TEXT'; value: string }
  | { type: 'DDL' | 'RADIO'; optionId: string }
  | { type: 'MC'; optionIds: string[] }
  | { type: 'ATTACHMENT'; file: AttachmentMetadata }

export type SurveySettings = {
  title: string
  description: string
  confirmationMessage: string
}

export type SurveySubmission = {
  settings: SurveySettings
  questions: SurveyQuestion[]
  answers: Record<string, SurveyAnswer>
}
