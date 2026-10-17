import { useState } from 'react'
import { useReducedMotion } from '@mantine/hooks'
import classes from './QuestionEditor.module.css'
import { getTextDirection } from '../../utils/getTextDirection'
import { TrashIcon } from '@radix-ui/react-icons'
import { ActionIcon, Button, Checkbox, Fieldset, Group, Stack, Text, TextInput, Tooltip, useDirection } from '@mantine/core'
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
  const { dir } = useDirection()
  const reducedMotion = useReducedMotion()
  const [removingIds, setRemovingIds] = useState<string[]>([])

  function removeOption(id: string) {
    if (!('options' in question)) return
    const index = question.options.findIndex((option) => option.id === id)
    const nextId = question.options[index + 1]?.id ?? question.options[index - 1]?.id
    onChange({ ...question, options: question.options.filter((option) => option.id !== id) })
    setRemovingIds((ids) => ids.filter((item) => item !== id))
    requestAnimationFrame(() => {
      const target = nextId ? `question-option-${nextId}` : `add-option-${question.id}`
      document.getElementById(target)?.focus()
    })
  }

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
        dir={getTextDirection(question.label, dir)}
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
              <div
                key={option.id}
                className={classes.option}
                data-removing={removingIds.includes(option.id) || undefined}
                inert={removingIds.includes(option.id)}
                onAnimationEnd={(event) => {
                  if (event.target === event.currentTarget && removingIds.includes(option.id)) removeOption(option.id)
                }}
              >
              <Group align="end" className={classes.optionContent}>
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
                  dir={getTextDirection(option.label, dir)}
                  style={{ flex: '1 1 12rem' }}
                />
                <Tooltip label={text.removeOption}>
                  <ActionIcon
                    type="button"
                    variant="subtle"
                    color="red"
                    size="lg"
                    aria-label={`${text.removeOption} ${index + 1}`}
                    onClick={() => {
                      if (reducedMotion) removeOption(option.id)
                      else setRemovingIds((ids) => [...ids, option.id])
                    }}
                  >
                    <TrashIcon width={18} height={18} aria-hidden="true" />
                  </ActionIcon>
                </Tooltip>
              </Group>
              </div>
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
            dir={getTextDirection(question.placeholder ?? '', dir)}
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
