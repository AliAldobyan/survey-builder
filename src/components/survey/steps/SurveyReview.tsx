import { Box, Button, Group, Stack, Text, Title } from '@mantine/core'
import type { SurveyWizardText } from '../../../i18n/translations'
import { useAppSelector } from '../../../store/hooks'
import { AnswerSummary } from '../AnswerSummary'
import { BrandLogo } from '../../BrandLogo'
import classes from './SurveyReview.module.css'

type SurveyReviewProps = {
  text: SurveyWizardText
  onEditSettings: () => void
  onEditQuestions: () => void
}

export function SurveyReview({ text, onEditSettings, onEditQuestions }: SurveyReviewProps) {
  const { settings, questions, answers } = useAppSelector((state) => state.survey)

  return (
    <Box className={classes.root}>
      <Group justify="space-between" gap="sm" className={classes.previewToolbar}>
        <Text size="sm" c="dimmed">{text.readOnlyReview}</Text>
        <Button type="button" variant="subtle" size="compact-xs" onClick={onEditQuestions}>
          {text.editAnswers}
        </Button>
      </Group>

      <div className={classes.columns}>
        <section className={classes.responses} aria-label={text.responses}>
          <div className={classes.formHeader}>
            <div dir="ltr"><BrandLogo width={140} /></div>
            <Title order={3} size="h2" dir="auto" className={classes.title}>
              {settings.title || text.notProvided}
            </Title>
            {settings.description.trim() && (
              <Text size="sm" dir="auto" className={classes.description}>
                {settings.description}
              </Text>
            )}
          </div>
          {questions.length === 0 ? (
            <Text p="md" c="dimmed">{text.noQuestionsConfigured}</Text>
          ) : (
            <ol className={classes.list}>
              {questions.map((question) => (
                <li key={question.id} className={classes.row}>
                  <Box miw={0}>
                    <Title order={4} size="h5" dir="auto" className={classes.question}>
                      {question.label || text.untitledQuestion}
                      {question.required && (
                        <span className={classes.required}> <span aria-hidden="true">*</span><span className={classes.srOnly}>{text.required}</span></span>
                      )}
                    </Title>
                    <div className={classes.readonlyFields}>
                      <AnswerSummary question={question} answer={answers[question.id]} text={text} />
                    </div>
                  </Box>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className={classes.sidebar}>
          <Stack gap="xs">
            <Title order={3} size="h5" c="brand.6">{text.confirmationMessage}</Title>
            <Text size="xs" c="dimmed">{text.confirmationMessageHint}</Text>
          </Stack>
          <Text component="blockquote" dir="auto" size="sm" className={classes.message}>
            {settings.confirmationMessage.trim() ? settings.confirmationMessage : text.notProvided}
          </Text>
          <Button type="button" variant="light" size="xs" fullWidth onClick={onEditSettings}>
            {text.editSettings}
          </Button>
        </aside>
      </div>
    </Box>
  )
}
