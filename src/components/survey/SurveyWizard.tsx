import { useState } from 'react'
import { Button, Group, Stack, Stepper, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useSurveySettingsForm } from './useSurveySettingsForm'
import { SurveySettings } from './steps/SurveySettings'
import { SurveyQuestions } from './steps/SurveyQuestions'
import { SurveyReview } from './steps/SurveyReview'
import { useAppSelector } from '../../store/hooks'
import { useSurveyFiles } from './attachments/useSurveyFiles'
import { validateAnswers } from './validateAnswers'
import type { SurveyWizardText } from '../../i18n/translations'

type SurveyWizardProps = {
  text: SurveyWizardText
}

export function SurveyWizard({ text }: SurveyWizardProps) {
  const [activeStep, setActiveStep] = useState(0)
  const settingsForm = useSurveySettingsForm()
  const [showAnswerErrors, setShowAnswerErrors] = useState(false)
  const { questions, answers } = useAppSelector((state) => state.survey)
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

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        handleStepChange(activeStep + 1)
      }}
    >
      <Stack gap="xl">
        <Stepper
          active={activeStep}
          onStepClick={handleStepChange}
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

        {activeStep === 1 && <SurveyQuestions text={text} errors={answerErrors} />}

        {activeStep === 2 && (
          <SurveyReview
            text={text}
            onEditSettings={() => handleStepChange(0)}
            onEditQuestions={() => handleStepChange(1)}
          />
        )}

        <Group justify="space-between">
          <Button
            type="button"
            variant="default"
            disabled={activeStep === 0}
            onClick={() => handleStepChange(activeStep - 1)}
          >
            {text.previous}
          </Button>
          {activeStep < lastStep && (
            <Button type="submit">
              {text.next}
            </Button>
          )}
        </Group>
      </Stack>
    </form>
  )
}
