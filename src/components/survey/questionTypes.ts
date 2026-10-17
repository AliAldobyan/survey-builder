import type { SurveyWizardText } from '../../i18n/translations'
import type { QuestionType } from '../../types/survey'

export function getQuestionTypes(text: SurveyWizardText) {
  return [
    { value: 'MC', label: text.multipleChoice },
    { value: 'DDL', label: text.dropdown },
    { value: 'RADIO', label: text.radio },
    { value: 'TEXT', label: text.textInput },
    { value: 'ATTACHMENT', label: text.attachment },
  ] satisfies { value: QuestionType; label: string }[]
}
