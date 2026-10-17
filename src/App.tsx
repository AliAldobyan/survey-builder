import { Badge, Container, Paper, Stack, Text, Title } from '@mantine/core'

function App() {
  return (
    <Container component="main" size="sm" py="xl">
      <Paper withBorder p="xl" radius="md">
        <Stack>
          <Badge variant="light">Survey configuration</Badge>
          <Title order={1}>Survey Builder</Title>
          <Text c="dimmed">
            Create and configure a building survey.
          </Text>
        </Stack>
      </Paper>
    </Container>
  )
}

export default App
