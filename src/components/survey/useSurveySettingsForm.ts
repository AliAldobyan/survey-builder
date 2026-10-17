import { useForm } from '@mantine/form'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateSettings } from '../../store/surveySlice'
import type { SurveySettings as SurveySettingsValues } from '../../store/surveySlice'

export function useSurveySettingsForm() {
  const settings = useAppSelector((state) => state.survey.settings)
  const dispatch = useAppDispatch()
  return useForm<SurveySettingsValues>({
    name: 'survey-settings',
    mode: 'controlled',
    // Copy Redux state so the form receives writable values.
    initialValues: { ...settings },
    validate: {
      title: (value) => value.trim() ? null : 'required',
    },
    validateInputOnChange: true,
    // Keep the survey draft up to date between steps.
    onValuesChange: (values) => dispatch(updateSettings(values)),
  })
}
