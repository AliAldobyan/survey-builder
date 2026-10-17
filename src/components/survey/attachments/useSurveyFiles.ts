import { createContext, useContext } from 'react'

export const SurveyFilesContext = createContext<Map<string, File> | null>(null)

export function useSurveyFiles() {
  const files = useContext(SurveyFilesContext)
  if (!files) throw new Error('useSurveyFiles must be used inside SurveyFilesProvider')
  return files
}
