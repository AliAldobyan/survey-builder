import type { SurveySettings } from '../../types/survey'
import { useState } from 'react'
import { Alert, Button, Group, Modal, Paper, Select, Skeleton, Stack, Text } from '@mantine/core'
import { useGetSurveyTemplatesQuery } from '../../services/surveyApi'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { replaceQuestions } from '../../store/surveySlice'
import type { Language, SurveyWizardText } from '../../i18n/translations'

type SurveyTemplatePickerProps = {
  text: SurveyWizardText
  language: Language
  onApplySettings: (settings: SurveySettings) => void
}

export function SurveyTemplatePicker({ text, language, onApplySettings }: SurveyTemplatePickerProps) {
  const { data: templates = [], isLoading, isError, isFetching, refetch } = useGetSurveyTemplatesQuery()
  const dispatch = useAppDispatch()
  const hasExistingDraft = useAppSelector((state) =>
    state.survey.questions.length > 0 || Object.values(state.survey.settings).some((value) => value.trim()),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [applied, setApplied] = useState(false)
  const selectedTemplate = templates.find((template) => template.id === selectedId)

  function applyTemplate() {
    if (!selectedTemplate) return
    const content = selectedTemplate.content[language]
    // Copy cached API data before putting it in the editable survey draft.
    dispatch(replaceQuestions(structuredClone(content.questions)))
    onApplySettings(structuredClone(content.settings))
    setConfirmOpen(false)
    setSelectedId(null)
    setApplied(true)
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        {isLoading ? (
          <Stack gap="xs" role="status" aria-label={text.templatesLoading}>
            <Text size="sm">{text.templatesLoading}</Text>
            <Skeleton height={36} />
          </Stack>
        ) : isError ? (
          <Alert color="red" role="alert">
            <Text size="sm">{text.templatesError}</Text>
            <Button type="button" variant="light" size="xs" mt="sm" loading={isFetching} onClick={() => { void refetch() }}>
              {text.templatesRetry}
            </Button>
          </Alert>
        ) : templates.length === 0 ? (
          <Text size="sm" c="dimmed">{text.templatesEmpty}</Text>
        ) : (
          <>
            <Select
              label={text.template}
              description={text.templateHint}
              placeholder={text.chooseTemplate}
              data={templates.map((template) => ({ value: template.id, label: template.name[language] }))}
              value={selectedId}
              onChange={(value) => { setSelectedId(value); setApplied(false) }}
              clearable
            />
            <Group justify="flex-end">
              <Button type="button" variant="light" disabled={!selectedTemplate} onClick={() => hasExistingDraft ? setConfirmOpen(true) : applyTemplate()}>
                {text.applyTemplate}
              </Button>
            </Group>
          </>
        )}
        {applied && <Text size="sm" c="var(--survey-brand-text)" role="status">{text.templateApplied}</Text>}
      </Stack>
      <Modal opened={confirmOpen} onClose={() => setConfirmOpen(false)} title={text.replaceQuestionsTitle} centered>
        <Stack>
          <Text size="sm">{text.replaceQuestionsMessage}</Text>
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={() => setConfirmOpen(false)}>{text.cancel}</Button>
            <Button type="button" onClick={applyTemplate}>{text.replaceQuestions}</Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  )
}
