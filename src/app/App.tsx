import { Badge, Button, Container, Paper, Stack, Text, Title } from '@mantine/core'
import { SurveyWizard } from '../components/survey/SurveyWizard'
import { SurveyFilesProvider } from '../components/survey/attachments/SurveyFilesProvider'
import { useLanguage } from '../i18n/useLanguage'
import { BrandLogo } from '../components/BrandLogo'
import classes from './App.module.css'

function App() {
  const { language, setLanguage, text } = useLanguage()
  const nextLanguage = language === 'en' ? 'ar' : 'en'

  return (
    <Container size="md" py="xl">
      <header className={classes.header}>
        <BrandLogo />
        <Button
          variant="default"
          size="sm"
          lang={nextLanguage}
          dir={nextLanguage === 'ar' ? 'rtl' : 'ltr'}
          onClick={() => setLanguage(nextLanguage)}
        >
          {text.switchLanguage}
        </Button>
      </header>
      <Paper component="main" withBorder p="xl" radius="md">
        <Stack>
          <Badge variant="light">{text.surveyConfiguration}</Badge>
          <Title order={1}>{text.surveyBuilder}</Title>
          <Text c="dimmed">{text.description}</Text>
          <SurveyFilesProvider>
            <SurveyWizard text={text.wizard} />
          </SurveyFilesProvider>
        </Stack>
      </Paper>
    </Container>
  )
}

export default App
