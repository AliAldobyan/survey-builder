import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { SurveyWizard } from '../components/survey/SurveyWizard'
import { SurveyFilesProvider } from '../components/survey/attachments/SurveyFilesProvider'
import { useLanguage } from '../i18n/useLanguage'
import { BrandLogo } from '../components/BrandLogo'
import { ThemeToggle } from '../components/ThemeToggle'
import classes from './App.module.css'

function App() {
  const { language, setLanguage, text } = useLanguage()
  const nextLanguage = language === 'en' ? 'ar' : 'en'

  return (
    <Container size="md" py="xl">
      <header className={classes.header}>
        <BrandLogo />
        <Group gap="xs" wrap="nowrap">
        <ThemeToggle lightLabel={text.lightTheme} darkLabel={text.darkTheme} />
        <Button
          variant="default"
          size="sm"
          lang={nextLanguage}
          dir={nextLanguage === 'ar' ? 'rtl' : 'ltr'}
          onClick={() => setLanguage(nextLanguage)}
        >
          {text.switchLanguage}
        </Button>
        </Group>
      </header>
      <Paper component="main" withBorder p="xl" radius="md">
        <Stack>
          <Badge variant="light">{text.surveyConfiguration}</Badge>
          <Title order={1}>{text.surveyBuilder}</Title>
          <Text c="dimmed">{text.description}</Text>
          <SurveyFilesProvider>
            <SurveyWizard text={text.wizard} language={language} />
          </SurveyFilesProvider>
        </Stack>
      </Paper>
    </Container>
  )
}

export default App
