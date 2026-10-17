import { useState } from 'react'
import { Button, Group, Stack, Stepper, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import type { SurveyWizardText } from '../../i18n/translations'

type SurveyWizardProps = {
  text: SurveyWizardText
}

export function SurveyWizard({ text }: SurveyWizardProps) {
  const [activeStep, setActiveStep] = useState(0)
  const isSmallScreen = useMediaQuery('(max-width: 36em)')
  const steps = [
    { label: text.settings, description: text.settingsPlaceholder },
    { label: text.questions, description: text.questionsPlaceholder },
    { label: text.review, description: text.reviewPlaceholder },
  ]
  const lastStep = steps.length - 1

  return (
    <Stack gap="xl">
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
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

      <Group justify="space-between">
        <Button
          variant="default"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
        >
          {text.previous}
        </Button>
        {activeStep < lastStep && (
          <Button onClick={() => setActiveStep((step) => Math.min(lastStep, step + 1))}>
            {text.next}
          </Button>
        )}
      </Group>
    </Stack>
  )
}
