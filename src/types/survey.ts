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
}

type AttachmentQuestion = BaseQuestion & {
  type: 'ATTACHMENT'
}

// The type determines which additional fields a question needs.
export type SurveyQuestion = ChoiceQuestion | TextQuestion | AttachmentQuestion

export type QuestionType = SurveyQuestion['type']
