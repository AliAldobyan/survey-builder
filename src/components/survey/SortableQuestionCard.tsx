import { DragHandleDots2Icon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { useCallback } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'
import { useReducedMotion } from '@mantine/hooks'
import { ActionIcon, Badge, Group, Paper, Stack, Text, Tooltip } from '@mantine/core'
import type { SurveyWizardText } from '../../i18n/translations'
import type { SurveyQuestion } from '../../types/survey'
import classes from './SortableQuestionCard.module.css'
import { QuestionAnswer } from './QuestionAnswer'

type SortableQuestionCardProps = {
  question: SurveyQuestion
  index: number
  typeLabel: string
  text: SurveyWizardText
  error?: string
  onEdit: () => void
  onRemove: () => void
  registerCard: (id: string, node: HTMLElement | null) => void
}

export function SortableQuestionCard({
  question, index, typeLabel, text, error, onEdit, onRemove, registerCard,
}: SortableQuestionCardProps) {
  const reducedMotion = useReducedMotion()
  const { ref, handleRef, isDragging } = useSortable({
    id: question.id,
    index,
    transition: reducedMotion ? null : { duration: 200, easing: 'ease' },
  })
  const questionName = `${text.question} ${index + 1}`

  const setCardRef = useCallback((node: HTMLLIElement | null) => {
    ref(node)
    registerCard(question.id, node)
  }, [ref, registerCard, question.id])

  return (
    // Keep drag measurements separate from the card's padding and border.
    <li
      className={classes.item}
      tabIndex={-1}
      aria-label={`${questionName}: ${question.label || text.untitledQuestion}`}
      ref={setCardRef}
    >
      <Paper withBorder p="md" radius="md" shadow={isDragging ? 'md' : undefined}>
        <Stack gap="sm">
          <Group justify="space-between" gap="xs">
            <Group gap="xs">
              <ActionIcon
                ref={handleRef} type="button" variant="subtle" color="gray" size="lg"
                aria-label={`${text.dragQuestion}: ${questionName}`}
                style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
              >
                <DragHandleDots2Icon width={18} height={18} aria-hidden="true" />
              </ActionIcon>
              <Text size="sm" c="dimmed">{questionName}</Text>
              <Badge variant="light" size="sm">{typeLabel}</Badge>
              {question.required && <Text size="xs" c="red">{text.required}</Text>}
            </Group>
            <Group gap={4}>
              <Tooltip label={text.editQuestion}>
                <ActionIcon type="button" variant="subtle" size="lg" aria-label={`${text.editQuestion}: ${questionName}`} onClick={onEdit}>
                  <Pencil1Icon width={18} height={18} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={text.removeQuestion}>
                <ActionIcon type="button" variant="subtle" color="red" size="lg" aria-label={`${text.removeQuestion}: ${questionName}`} onClick={onRemove}>
                  <TrashIcon width={18} height={18} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <div id={`answer-field-${question.id}`} tabIndex={-1}>
            <QuestionAnswer question={question} text={text} error={error} />
          </div>
        </Stack>
      </Paper>
    </li>
  )
}
