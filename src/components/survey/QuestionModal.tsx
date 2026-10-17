import { Button, Group, Modal, NativeSelect, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyQuestion } from '../../types/survey'
import { createQuestion } from './createQuestion'
import { QuestionEditor } from './QuestionEditor'
import { getQuestionTypes } from './questionTypes'

type QuestionModalProps = {
  question: SurveyQuestion
  editing: boolean
  text: SurveyWizardText
  onSave: (question: SurveyQuestion) => void
  onClose: () => void
}

export function QuestionModal({ question, editing, text, onSave, onClose }: QuestionModalProps) {
  const fullScreen = useMediaQuery('(max-width: 36em)')
  // Keep edits local; saving is the only action that updates the survey draft.
  const form = useForm<{ question: SurveyQuestion }>({
    mode: 'controlled',
    initialValues: { question: structuredClone(question) },
    validate: ({ question: values }) => {
      const errors: Record<string, string> = {}
      if (!values.label.trim()) errors.label = 'required'
      if ('options' in values && (
        values.options.length === 0 || values.options.some((option) => !option.label.trim())
      )) {
        errors.options = 'required'
      }
      return errors
    },
  })
  const questionTypes = getQuestionTypes(text)

  return (
    <Modal
      opened
      onClose={onClose}
      title={editing ? text.editQuestion : text.addQuestion}
      size="lg"
      fullScreen={fullScreen}
      centered
      closeButtonProps={{ 'aria-label': text.cancel }}
    >
      <form
        noValidate
        onSubmit={(event) => {
          // Modal events still bubble through React to the outer wizard form.
          event.stopPropagation()
          form.onSubmit((values) => onSave(values.question), (errors) => {
            const blankOption = 'options' in form.values.question
              ? form.values.question.options.find((option) => !option.label.trim())
              : undefined
            const targetId = errors.label
              ? `question-label-${question.id}`
              : blankOption ? `question-option-${blankOption.id}` : `add-option-${question.id}`
            document.getElementById(targetId)?.focus()
          })(event)
        }}
      >
        <Stack>
          <NativeSelect
            label={text.questionType}
            data={questionTypes}
            value={form.values.question.type}
            onChange={(event) => {
              const selected = questionTypes.find((item) => item.value === event.currentTarget.value)
              if (!selected || selected.value === form.values.question.type) return
              const next = createQuestion(selected.value)
              // Replace the draft question so fields from the previous type are removed.
              form.setFieldValue('question', {
                ...next,
                id: question.id,
                label: form.values.question.label,
                required: form.values.question.required,
              })
            }}
          />
          <QuestionEditor
            question={form.values.question}
            text={text}
            onChange={(values) => form.setFieldValue('question', values)}
            labelError={form.errors.label ? text.questionTextRequired : undefined}
            optionsError={form.errors.options ? text.optionsRequired : undefined}
          />
          <Group justify="end">
            <Button type="button" variant="default" onClick={onClose}>{text.cancel}</Button>
            <Button type="submit" loading={form.submitting}>{text.saveQuestion}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
