import { useState } from 'react'
import { FileInput, Group, Stack, Text } from '@mantine/core'
import type { SurveyWizardText } from '../../../i18n/translations'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setAttachmentAnswer } from '../../../store/surveySlice'
import { useSurveyFiles } from './useSurveyFiles'
import { acceptedFiles, isImageFile, validateFile } from './fileValidation'
import { ImageThumbnail } from './ImageThumbnail'

type AttachmentInputProps = {
  questionId: string
  label: string
  required: boolean
  text: SurveyWizardText
}

export function AttachmentInput({ questionId, label, required, text }: AttachmentInputProps) {
  const answer = useAppSelector((state) => state.survey.answers[questionId])
  const dispatch = useAppDispatch()
  const files = useSurveyFiles()
  const [error, setError] = useState<'type' | 'size' | null>(null)
  const metadata = answer?.type === 'ATTACHMENT' ? answer.file : undefined
  const file = metadata ? files.get(metadata.id) ?? null : null

  function handleChange(selected: File | null) {
    const validationError = selected ? validateFile(selected) : null
    setError(validationError)
    if (validationError) return

    if (metadata) files.delete(metadata.id)
    if (!selected) {
      dispatch(setAttachmentAnswer({ questionId, file: null }))
      return
    }

    const id = crypto.randomUUID()
    files.set(id, selected)
    dispatch(setAttachmentAnswer({
      questionId,
      file: {
        id, name: selected.name, size: selected.size,
        type: selected.type, lastModified: selected.lastModified,
      },
    }))
  }

  return (
    <Stack gap="sm">
      <FileInput
        id={`answer-${questionId}`}
        label={label}
        required={required}
        description={text.fileUploadHint}
        placeholder={text.chooseFile}
        accept={acceptedFiles}
        value={file}
        onChange={handleChange}
        clearable
        clearButtonProps={{ 'aria-label': text.removeFile }}
        error={error === 'type' ? text.fileTypeError : error === 'size' ? text.fileSizeError : undefined}
      />
      {file && metadata && (
        <Group align="start">
          {isImageFile(file) && <ImageThumbnail key={metadata.id} file={file} alt={`${text.imagePreview}: ${file.name}`} />}
          <Text size="sm" c="dimmed">{Math.ceil(file.size / 1024)} KB</Text>
        </Group>
      )}
    </Stack>
  )
}
