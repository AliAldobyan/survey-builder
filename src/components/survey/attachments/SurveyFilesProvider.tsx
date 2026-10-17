import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAppSelector } from '../../../store/hooks'
import { SurveyFilesContext } from './useSurveyFiles'

export function SurveyFilesProvider({ children }: { children: ReactNode }) {
  // File objects stay in memory outside the serializable Redux state.
  const [files] = useState(() => new Map<string, File>())
  const answers = useAppSelector((state) => state.survey.answers)

  useEffect(() => {
    const activeIds = new Set(Object.values(answers).flatMap((answer) =>
      answer?.type === 'ATTACHMENT' ? [answer.file.id] : [],
    ))
    for (const id of files.keys()) {
      if (!activeIds.has(id)) files.delete(id)
    }
  }, [answers, files])

  return <SurveyFilesContext value={files}>{children}</SurveyFilesContext>
}
