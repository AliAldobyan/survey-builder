import { useCallback, useRef, useState } from 'react'
import { Button, Group, Stack, Text } from '@mantine/core'
import type { SurveyWizardText } from '../../../i18n/translations'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { addQuestion, updateQuestion, removeQuestion, moveQuestion } from '../../../store/surveySlice'
import type { SurveyQuestion } from '../../../types/survey'
import { createQuestion } from '../createQuestion'
import { SortableQuestionCard } from '../SortableQuestionCard'
import { QuestionModal } from '../QuestionModal'
import { getQuestionTypes } from '../questionTypes'
import { DragDropProvider } from '@dnd-kit/react'
import type { DragEndEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { Accessibility } from '@dnd-kit/dom'

type SurveyQuestionsProps = {
  text: SurveyWizardText
}

export function SurveyQuestions({ text }: SurveyQuestionsProps) {
  const [editor, setEditor] = useState<{
    question: SurveyQuestion
    editing: boolean
  } | null>(null)
  const questions = useAppSelector((state) => state.survey.questions)
  const dispatch = useAppDispatch()
  const questionCards = useRef(new Map<string, HTMLElement>())
  const addButton = useRef<HTMLButtonElement>(null)
  const questionTypes = getQuestionTypes(text)

  function openAdd() {
    setEditor({ question: createQuestion('TEXT'), editing: false })
  }

  function handleSave(question: SurveyQuestion) {
    if (!editor) return
    if (editor.editing) {
      dispatch(updateQuestion(question))
    } else {
      dispatch(addQuestion(question))

    }
    setEditor(null)
  }

  const registerCard = useCallback((id: string, node: HTMLElement | null) => {
    if (node) questionCards.current.set(id, node)
    else questionCards.current.delete(id)
  }, [])

  function handleRemove(id: string, index: number) {
    const nextFocusId = questions[index + 1]?.id ?? questions[index - 1]?.id
    dispatch(removeQuestion(id))
    // Keep keyboard focus in the list, or return it to Add when the list is empty.
    requestAnimationFrame(() => {
      if (nextFocusId) questionCards.current.get(nextFocusId)?.focus()
      else addButton.current?.focus()
    })
  }

  return (
    <Stack>
      {questions.length === 0 ? (
        <Text c="dimmed">{text.noQuestions}</Text>
      ) : (
        <Stack>
          <Text size="sm" c="dimmed">{text.dragHint}</Text>
          <DragDropProvider
            plugins={(defaults) => [
              ...defaults.filter((plugin) => plugin !== Accessibility),
              Accessibility.configure({
                screenReaderInstructions: { draggable: text.dragInstructions },
                announcements: {
                  dragstart: () => text.dragStarted,
                  dragend: (event: DragEndEvent) => event.canceled ? text.dragCanceled : text.dragFinished,
                },
              }),
            ]}
            onDragEnd={(event) => {
              if (event.canceled) return
              const { source } = event.operation
              // The sortable source reports its final position after a drop.
              if (isSortable(source) && source.initialIndex !== source.index) {
                dispatch(moveQuestion({ id: String(source.id), toIndex: source.index }))
              }
            }}
          >
            <Stack component="ol" m={0} p={0} style={{ listStyle: 'none' }}>
              {questions.map((question, index) => (
                <SortableQuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  typeLabel={questionTypes.find((item) => item.value === question.type)?.label ?? ''}
                  text={text}
                  onEdit={() => setEditor({ question, editing: true })}
                  onRemove={() => handleRemove(question.id, index)}
                  registerCard={registerCard}
                />
              ))}
            </Stack>
          </DragDropProvider>
        </Stack>
      )}
      <Group justify="end">
        <Button ref={addButton} type="button" onClick={() => openAdd()}>
          + {text.addQuestion}
        </Button>
      </Group>
      {editor && (
        <QuestionModal
          key={editor.question.id}
          question={editor.question}
          editing={editor.editing}
          text={text}
          onSave={handleSave}
          onClose={() => setEditor(null)}
        />
      )}
    </Stack>
  )
}
