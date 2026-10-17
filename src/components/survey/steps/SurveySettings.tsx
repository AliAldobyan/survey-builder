import { useState } from 'react'
import classes from './SurveySettings.module.css'
import { SurveyTemplatePicker } from '../SurveyTemplatePicker'
import { Stack, Tabs, Text, Textarea, TextInput } from '@mantine/core'
import type { Language, SurveyWizardText } from '../../../i18n/translations'
import type { UseFormReturnType } from '@mantine/form'
import type { SurveySettings as SurveySettingsValues } from '../../../store/surveySlice'

type SurveySettingsProps = {
  language: Language
  text: SurveyWizardText
  form: UseFormReturnType<SurveySettingsValues>
}

export function SurveySettings({ text, form, language }: SurveySettingsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('build')
  const [templateApplied, setTemplateApplied] = useState(false)

  return (
    <Tabs
      variant="pills"
      classNames={{ list: classes.tabList, tab: classes.tab }}
      value={form.errors.title ? 'build' : activeTab}
      onChange={(value) => {
        form.clearErrors()
        setActiveTab(value)
      }}
    >
      <Tabs.List grow mb="md">
        <Tabs.Tab value="build">{text.buildSurvey}</Tabs.Tab>
        <Tabs.Tab value="template">{text.selectTemplate}</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="build">
        <Stack>
          {templateApplied && <Text size="sm" c="brand.6" role="status">{text.templateApplied}</Text>}
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
      </Tabs.Panel>

      <Tabs.Panel value="template">
        <SurveyTemplatePicker
          text={text}
          language={language}
          onApplySettings={(settings) => {
            // setValues also updates Redux through the form's onValuesChange.
            form.setValues(settings)
            form.clearErrors()
            setTemplateApplied(true)
            setActiveTab('build')
          }}
        />
      </Tabs.Panel>
    </Tabs>
  )
}
