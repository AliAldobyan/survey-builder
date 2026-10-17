import { Checkbox, NativeSelect, Radio, Stack, Text, Textarea, TextInput } from '@mantine/core'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyAnswer, SurveyQuestion } from '../../types/survey'
import { useSurveyFiles } from './attachments/useSurveyFiles'
import { isImageFile } from './attachments/fileValidation'
import { ImageThumbnail } from './attachments/ImageThumbnail'

type AnswerSummaryProps = {
  question: SurveyQuestion
  answer: SurveyAnswer | undefined
  text: SurveyWizardText
}

export function AnswerSummary({ question, answer, text }: AnswerSummaryProps) {
  const files = useSurveyFiles()
  const label = question.label || text.untitledQuestion

  if (question.type === 'TEXT') {
    const value = answer?.type === 'TEXT' ? answer.value : ''
    return question.multiline ? (
      <Textarea aria-label={label} value={value} placeholder={text.notAnswered} readOnly autosize minRows={3} dir="auto" />
    ) : (
      <TextInput aria-label={label} value={value} placeholder={text.notAnswered} readOnly dir="auto" />
    )
  }

  if (question.type === 'DDL') {
    return (
      <NativeSelect
        aria-label={label}
        disabled
        value={answer?.type === 'DDL' ? answer.optionId : ''}
        data={[
          { value: '', label: text.notAnswered },
          ...question.options.map((option) => ({ value: option.id, label: option.label })),
        ]}
      />
    )
  }

  if (question.type === 'RADIO') {
    return (
      <Radio.Group aria-label={label} value={answer?.type === 'RADIO' ? answer.optionId : ''}>
        <Stack gap="xs">
          {question.options.map((option) => (
            <Radio key={option.id} disabled value={option.id} label={<span dir="auto">{option.label}</span>} />
          ))}
          {answer?.type !== 'RADIO' && <Text size="sm" c="dimmed">{text.notAnswered}</Text>}
        </Stack>
      </Radio.Group>
    )
  }

  if (question.type === 'MC') {
    const selectedIds = answer?.type === 'MC' ? answer.optionIds : []
    return (
      <Checkbox.Group aria-label={label} value={selectedIds}>
        <Stack gap="xs">
          {question.options.map((option) => (
            <Checkbox key={option.id} disabled value={option.id} label={<span dir="auto">{option.label}</span>} />
          ))}
          {selectedIds.length === 0 && <Text size="sm" c="dimmed">{text.notAnswered}</Text>}
        </Stack>
      </Checkbox.Group>
    )
  }

  const metadata = answer?.type === 'ATTACHMENT' ? answer.file : undefined
  const file = metadata ? files.get(metadata.id) : undefined
  return (
    <Stack gap="xs">
      <TextInput aria-label={label} readOnly value={metadata?.name ?? ''} placeholder={text.notAnswered} dir="auto" />
      {metadata && <Text size="sm" c="dimmed">{Math.ceil(metadata.size / 1024)} KB</Text>}
      {file && isImageFile(file) && (
        <ImageThumbnail key={metadata?.id} file={file} alt={`${text.imagePreview}: ${file.name}`} />
      )}
    </Stack>
  )
}
