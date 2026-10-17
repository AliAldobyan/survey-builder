import { getTextDirection } from '../../utils/getTextDirection'
import { Checkbox, NativeSelect, Radio, Stack, Textarea, TextInput } from '@mantine/core'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyQuestion } from '../../types/survey'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setTextAnswer, setSingleChoiceAnswer, setMultipleChoiceAnswer } from '../../store/surveySlice'
import { AttachmentInput } from './attachments/AttachmentInput'

type QuestionAnswerProps = {
  question: SurveyQuestion
  text: SurveyWizardText
  error?: string
}

export function QuestionAnswer({ question, text, error }: QuestionAnswerProps) {
  const answer = useAppSelector((state) => state.survey.answers[question.id])
  const dispatch = useAppDispatch()
  const label = question.label || text.untitledQuestion
  const value = answer?.type === 'TEXT' ? answer.value : ''

  if (question.type === 'TEXT') {
    return question.multiline ? (
      <Textarea
        label={label}
        required={question.required}
        error={error}
        placeholder={question.placeholder}
        value={value}
        onChange={(event) => dispatch(setTextAnswer({
          questionId: question.id, value: event.currentTarget.value,
        }))}
        autosize
        minRows={3}
        dir={getTextDirection(value || question.label)}
      />
    ) : (
      <TextInput
        label={label}
        required={question.required}
        error={error}
        placeholder={question.placeholder}
        value={value}
        onChange={(event) => dispatch(setTextAnswer({
          questionId: question.id, value: event.currentTarget.value,
        }))}
        dir={getTextDirection(value || question.label)}
      />
    )
  }

  if (question.type === 'RADIO') {
    return (
      <Radio.Group
        name={`answer-${question.id}`}
        label={label}
        required={question.required}
        error={error}
        value={answer?.type === 'RADIO' ? answer.optionId : ''}
        onChange={(optionId) => dispatch(setSingleChoiceAnswer({ questionId: question.id, optionId }))}
      >
        <Stack gap="xs" mt="xs">
          {question.options.map((option) => (
            <Radio key={option.id} value={option.id} label={<span dir="auto">{option.label}</span>} />
          ))}
        </Stack>
      </Radio.Group>
    )
  }

  if (question.type === 'DDL') {
    return (
      <NativeSelect
        dir={getTextDirection(question.label)}
        label={label}
        required={question.required}
        error={error}
        value={answer?.type === 'DDL' ? answer.optionId : ''}
        data={[
          { value: '', label: text.selectAnswer },
          ...question.options.map((option) => ({ value: option.id, label: option.label })),
        ]}
        onChange={(event) => dispatch(setSingleChoiceAnswer({
          questionId: question.id, optionId: event.currentTarget.value,
        }))}
      />
    )
  }

  if (question.type === 'MC') {
    return (
      <Checkbox.Group
        label={label}
        required={question.required}
        error={error}
        value={answer?.type === 'MC' ? answer.optionIds : []}
        onChange={(optionIds) => dispatch(setMultipleChoiceAnswer({ questionId: question.id, optionIds }))}
      >
        <Stack gap="xs" mt="xs">
          {question.options.map((option) => (
            <Checkbox key={option.id} value={option.id} label={<span dir="auto">{option.label}</span>} />
          ))}
        </Stack>
      </Checkbox.Group>
    )
  }

  return (
    <AttachmentInput questionId={question.id} label={label} required={question.required} text={text} validationError={error} />
  )
}
