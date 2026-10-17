import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useLanguage } from '../i18n/useLanguage'

function App() {
  const { language, setLanguage, text } = useLanguage()
  const nextLanguage = language === 'en' ? 'ar' : 'en'

  return (
    <Container component="main" size="sm" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Stack>
          <Group justify="space-between">
            <Badge variant="light">{text.surveyConfiguration}</Badge>
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
          <Title order={1}>{text.surveyBuilder}</Title>
          <Text c="dimmed">{text.description}</Text>
        </Stack>
      </Paper>
    </Container>
  )
}

export default App
