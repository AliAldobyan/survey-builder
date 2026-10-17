import { useRef, useState } from 'react'
import { Alert, Button, Group, Paper, Stack, Stepper, Text, ThemeIcon, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useSurveySettingsForm } from './useSurveySettingsForm'
import { SurveySettings } from './steps/SurveySettings'
import { SurveyQuestions } from './steps/SurveyQuestions'
import { SurveyReview } from './steps/SurveyReview'
import { useAppSelector } from '../../store/hooks'
import { useSurveyFiles } from './attachments/useSurveyFiles'
import { validateAnswers } from './validateAnswers'
import { buildSurveyPayload } from './buildSurveyPayload'
import { useSubmitSurveyMutation } from '../../services/surveyApi'
import type { SurveyWizardText } from '../../i18n/translations'

type SurveyWizardProps = {
  text: SurveyWizardText
}

export function SurveyWizard({ text }: SurveyWizardProps) {
  const [activeStep, setActiveStep] = useState(0)
  const settingsForm = useSurveySettingsForm()
  const [showAnswerErrors, setShowAnswerErrors] = useState(false)
  const draft = useAppSelector((state) => state.survey)
  const { settings, questions, answers } = draft
  const [submitSurvey, submission] = useSubmitSurveyMutation()
  const submittingRef = useRef(false)
  const files = useSurveyFiles()
  const answerErrors = showAnswerErrors ? validateAnswers(questions, answers, files) : {}
  const isSmallScreen = useMediaQuery('(max-width: 36em)')
  const steps = [
    { label: text.settings, description: text.settingsPlaceholder },
    { label: text.questions, description: text.questionsPlaceholder },
    { label: text.review, description: text.reviewPlaceholder },
  ]
  const lastStep = steps.length - 1

  async function handleStepChange(nextStep: number) {
    if (submittingRef.current || submission.isSuccess) return
    submission.reset()
    // Validate settings before moving to a later step.
    if (activeStep === 0 && nextStep > 0) {
      const result = await settingsForm.validate()
      if (result.hasErrors) {
        // Move keyboard focus to the first field that needs attention.
        const firstInvalidField = Object.keys(result.errors)[0]
        settingsForm.getInputNode(firstInvalidField)?.focus()
        return
      }
    }

    if (activeStep === 1 && nextStep > 1) {
      const errors = validateAnswers(questions, answers, files)
      setShowAnswerErrors(true)
      if (questions.length === 0) return
      const firstInvalidQuestion = questions.find((question) => errors[question.id])
      if (firstInvalidQuestion) {
        const field = document.getElementById(`answer-field-${firstInvalidQuestion.id}`)
        const input = field?.querySelector<HTMLElement>('input:not([type="hidden"]):not([type="file"]), textarea, select, button')
        const target = input ?? field
        target?.focus()
        return
      }
    }

    setActiveStep(Math.max(0, Math.min(lastStep, nextStep)))
  }

  async function handleSubmit() {
    if (submittingRef.current || submission.isSuccess) return
    if (!settings.title.trim()) {
      setActiveStep(0)
      await settingsForm.validate()
      settingsForm.getInputNode('title')?.focus()
      return
    }
    const errors = validateAnswers(questions, answers, files)
    if (questions.length === 0 || Object.keys(errors).length > 0) {
      setShowAnswerErrors(true)
      setActiveStep(1)
      return
    }

    submittingRef.current = true
    try {
      await submitSurvey(buildSurveyPayload(draft)).unwrap()
    } catch {
      // RTK Query exposes the error so the same form can be retried.
    } finally {
      submittingRef.current = false
    }
  }

  if (submission.isSuccess) {
    return (
      <Paper withBorder px="xl" py={48} radius="md" role="status">
        <Stack gap="md" align="center" ta="center" maw={480} mx="auto">
          <ThemeIcon size={80} radius="50%" variant="light" color="brand" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <path d="m5 12 4 4L19 6" />
            </svg>
          </ThemeIcon>
          <Title order={2} size="h3" c="brand.6">{text.submissionSuccess}</Title>
          <Text dir="auto" c="dimmed" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {settings.confirmationMessage.trim() || text.submissionSuccessMessage}
          </Text>
        </Stack>
      </Paper>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (activeStep === lastStep) void handleSubmit()
        else void handleStepChange(activeStep + 1)
      }}
    >
      <Stack gap="xl">
        <Stepper
          active={activeStep}
          onStepClick={(step) => { void handleStepChange(step) }}
          allowNextStepsSelect={false}
          size="sm"
          orientation={isSmallScreen ? 'vertical' : 'horizontal'}
        >
          {steps.map((step) => (
            <Stepper.Step key={step.label} label={step.label} />
          ))}
        </Stepper>

        <div aria-live="polite" aria-atomic="true">
          <Text component="h2" size="lg" fw={600} m={0}>
            {steps[activeStep].label}
          </Text>
          <Text c="dimmed" mt="xs">{steps[activeStep].description}</Text>
        </div>

        {activeStep === 0 && (
          <SurveySettings text={text} form={settingsForm} />
        )}

        {activeStep === 1 && showAnswerErrors && questions.length === 0 && (
          <Alert color="red" role="alert">{text.questionRequiredError}</Alert>
        )}
        {activeStep === 1 && <SurveyQuestions text={text} errors={answerErrors} />}

        {activeStep === 2 && (
          <fieldset disabled={submission.isLoading} style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
          <SurveyReview
            text={text}
            onEditSettings={() => handleStepChange(0)}
            onEditQuestions={() => handleStepChange(1)}
          />
          </fieldset>
        )}

        {submission.isError && (
          <Alert color="red" role="alert">{text.submissionError}</Alert>
        )}
        {submission.isLoading && <Text size="sm" role="status">{text.submitting}</Text>}

        <Group justify="space-between">
          <Button
            type="button"
            variant="default"
            disabled={activeStep === 0 || submission.isLoading}
            onClick={() => handleStepChange(activeStep - 1)}
          >
            {text.previous}
          </Button>
          <Button type="submit" loading={submission.isLoading}>
            {activeStep < lastStep ? text.next : submission.isError ? text.retrySubmission : text.submit}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
