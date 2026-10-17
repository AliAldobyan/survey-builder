import { useEffect, useLayoutEffect, useState } from 'react'
import { useDirection } from '@mantine/core'
import { translations } from './translations'
import type { Language } from './translations'

const storageKey = 'survey-builder-language'

function getSavedLanguage(): Language {
  try {
    return localStorage.getItem(storageKey) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getSavedLanguage)
  const { setDirection } = useDirection()
  const text = translations[language]

  useLayoutEffect(() => {
    document.documentElement.lang = language
    document.title = text.surveyBuilder
    setDirection(language === 'ar' ? 'rtl' : 'ltr')
  }, [language, text.surveyBuilder, setDirection])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, language)
    } catch {
      // Switching still works when browser storage is unavailable.
    }
  }, [language])

  return { language, setLanguage, text }
}
