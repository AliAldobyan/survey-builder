import { ActionIcon, Button, Checkbox, Fieldset, Group, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyQuestion } from '../../types/survey'

type QuestionEditorProps = {
  question: SurveyQuestion
  text: SurveyWizardText
  onChange: (question: SurveyQuestion) => void
  labelError?: string
  optionsError?: string
}

export function QuestionEditor({ question, text, onChange, labelError, optionsError }: QuestionEditorProps) {
  return (
    <Stack>
      <TextInput
        id={`question-label-${question.id}`}
        data-autofocus
        label={text.questionText}
        required
        error={labelError}
        placeholder={text.untitledQuestion}
        value={question.label}
        onChange={(event) => onChange({ ...question, label: event.currentTarget.value })}
        dir="auto"
      />
      <Checkbox
        label={text.answerRequired}
        checked={question.required}
        onChange={(event) => onChange({ ...question, required: event.currentTarget.checked })}
      />

      {/* Only choice questions have an options array. */}
      {'options' in question && (
        <Fieldset legend={text.options}>
          <Stack>
            {question.options.map((option, index) => (
              <Group key={option.id} align="end">
                <TextInput
                  id={`question-option-${option.id}`}
                  label={`${text.option} ${index + 1}`}
                  value={option.label}
                  onChange={(event) => {
                    const label = event.currentTarget.value
                    onChange({
                      ...question,
                      options: question.options.map((item) =>
                        item.id === option.id ? { ...item, label } : item,
                      ),
                    })
                  }}
                  dir="auto"
                  style={{ flex: '1 1 12rem' }}
                />
                <Tooltip label={text.removeOption}>
                  <ActionIcon
                    type="button"
                    variant="subtle"
                    color="red"
                    size="lg"
                    aria-label={`${text.removeOption} ${index + 1}`}
                    onClick={() => onChange({
                      ...question,
                      options: question.options.filter((item) => item.id !== option.id),
                    })}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                      <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
                    </svg>
                  </ActionIcon>
                </Tooltip>
              </Group>
            ))}
            {optionsError && <Text c="red" size="sm" role="alert">{optionsError}</Text>}
            <Button
              id={`add-option-${question.id}`}
              type="button"
              variant="light"
              onClick={() => onChange({
                ...question,
                options: [...question.options, { id: crypto.randomUUID(), label: '' }],
              })}
            >
              {text.addOption}
            </Button>
          </Stack>
        </Fieldset>
      )}

      {question.type === 'TEXT' && (
        <Stack>
          <TextInput
            label={text.inputPlaceholder}
            description={text.inputPlaceholderHint}
            placeholder={text.inputPlaceholderExample}
            value={question.placeholder ?? ''}
            onChange={(event) => onChange({ ...question, placeholder: event.currentTarget.value })}
            dir="auto"
          />
          <Checkbox
            label={text.multilineAnswer}
            checked={question.multiline}
            onChange={(event) => onChange({ ...question, multiline: event.currentTarget.checked })}
          />
        </Stack>
      )}
    </Stack>
  )
}
