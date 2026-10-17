import { Button, Checkbox, Fieldset, Group, Stack, TextInput } from '@mantine/core'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyQuestion } from '../../types/survey'

type QuestionEditorProps = {
  question: SurveyQuestion
  text: SurveyWizardText
  onChange: (question: SurveyQuestion) => void
}

export function QuestionEditor({ question, text, onChange }: QuestionEditorProps) {
  return (
    <Stack>
      <TextInput
        label={text.questionText}
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
                <Button
                  type="button"
                  variant="subtle"
                  color="red"
                  aria-label={`${text.removeOption} ${index + 1}`}
                  onClick={() => onChange({
                    ...question,
                    options: question.options.filter((item) => item.id !== option.id),
                  })}
                >
                  {text.removeOption}
                </Button>
              </Group>
            ))}
            <Button
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
        <Checkbox
          label={text.multilineAnswer}
          checked={question.multiline}
          onChange={(event) => onChange({ ...question, multiline: event.currentTarget.checked })}
        />
      )}
    </Stack>
  )
}
