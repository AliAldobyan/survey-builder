import { useState } from 'react'
import { Badge, Button, Group, NativeSelect, Paper, Stack, Text } from '@mantine/core'
import type { SurveyWizardText } from '../../../i18n/translations'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { addQuestion, updateQuestion } from '../../../store/surveySlice'
import type { QuestionType } from '../../../types/survey'
import { createQuestion } from '../createQuestion'
import { QuestionEditor } from '../QuestionEditor'

type SurveyQuestionsProps = {
  text: SurveyWizardText
}

export function SurveyQuestions({ text }: SurveyQuestionsProps) {
  const [questionType, setQuestionType] = useState<QuestionType>('TEXT')
  const questions = useAppSelector((state) => state.survey.questions)
  const dispatch = useAppDispatch()
  const questionTypes = [
    { value: 'MC', label: text.multipleChoice },
    { value: 'DDL', label: text.dropdown },
    { value: 'RADIO', label: text.radio },
    { value: 'TEXT', label: text.freeText },
    { value: 'ATTACHMENT', label: text.attachment },
  ] satisfies { value: QuestionType; label: string }[]

  return (
    <Stack>
      <Group align="end">
        <NativeSelect
          label={text.questionType}
          data={questionTypes}
          value={questionType}
          onChange={(event) => {
            const selected = questionTypes.find((item) => item.value === event.currentTarget.value)
            if (selected) setQuestionType(selected.value)
          }}
        />
        <Button type="button" onClick={() => dispatch(addQuestion(createQuestion(questionType)))}>
          {text.addQuestion}
        </Button>
      </Group>

      {questions.length === 0 ? (
        <Text c="dimmed">{text.noQuestions}</Text>
      ) : (
        <Stack component="ol" m={0} p={0} style={{ listStyle: 'none' }}>
          {questions.map((question, index) => (
            <Paper component="li" key={question.id} withBorder p="md" radius="md">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">{text.question} {index + 1}</Text>
                  <Badge variant="light">
                    {questionTypes.find((item) => item.value === question.type)?.label}
                  </Badge>
                </Group>
                <QuestionEditor
                  question={question}
                  text={text}
                  onChange={(updatedQuestion) => dispatch(updateQuestion(updatedQuestion))}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
