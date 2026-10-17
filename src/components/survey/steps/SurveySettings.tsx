import { Stack, Textarea, TextInput } from '@mantine/core'
import type { SurveyWizardText } from '../../../i18n/translations'
import type { UseFormReturnType } from '@mantine/form'
import type { SurveySettings as SurveySettingsValues } from '../../../store/surveySlice'

type SurveySettingsProps = {
  text: SurveyWizardText
  form: UseFormReturnType<SurveySettingsValues>
}

export function SurveySettings({ text, form }: SurveySettingsProps) {
  return (
    <Stack>
      <TextInput
        label={text.surveyTitle}
        required
        {...form.getInputProps('title')}
        // Resolve the error text here so it follows the selected language.
        error={form.errors.title ? text.titleRequired : undefined}
        dir="auto"
      />
      <Textarea
        label={text.surveyDescription}
        {...form.getInputProps('description')}
        autosize
        minRows={3}
        dir="auto"
      />
      <Textarea
        label={text.confirmationMessage}
        description={text.confirmationMessageHint}
        {...form.getInputProps('confirmationMessage')}
        autosize
        minRows={2}
        dir="auto"
      />
    </Stack>
  )
}
