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
  onEdit: () => void
  onRemove: () => void
  registerCard: (id: string, node: HTMLElement | null) => void
}

export function SortableQuestionCard({
  question, index, typeLabel, text, onEdit, onRemove, registerCard,
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
                  {[5, 9, 13].map((y) => (
                    <g key={y}><circle cx="6" cy={y} r="1.3" /><circle cx="12" cy={y} r="1.3" /></g>
                  ))}
                </svg>
              </ActionIcon>
              <Text size="sm" c="dimmed">{questionName}</Text>
              <Badge variant="light" size="sm">{typeLabel}</Badge>
              {question.required && <Text size="xs" c="red">{text.required}</Text>}
            </Group>
            <Group gap={4}>
              <Tooltip label={text.editQuestion}>
                <ActionIcon type="button" variant="subtle" size="lg" aria-label={`${text.editQuestion}: ${questionName}`} onClick={onEdit}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z" />
                  </svg>
                </ActionIcon>
              </Tooltip>
              <Tooltip label={text.removeQuestion}>
                <ActionIcon type="button" variant="subtle" color="red" size="lg" aria-label={`${text.removeQuestion}: ${questionName}`} onClick={onRemove}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
                  </svg>
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
          <QuestionAnswer question={question} text={text} />
        </Stack>
      </Paper>
    </li>
  )
}
