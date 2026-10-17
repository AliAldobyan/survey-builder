export const translations = {
  en: {
    surveyConfiguration: 'Survey configuration',
    surveyBuilder: 'Survey Builder',
    description: 'Create and configure a building survey.',
    switchLanguage: 'العربية',
  },
  ar: {
    surveyConfiguration: 'إعداد الاستبيان',
    surveyBuilder: 'منشئ الاستبيانات',
    description: 'أنشئ استبيان مبنى واضبط إعداداته.',
    switchLanguage: 'English',
  },
} as const

export type Language = keyof typeof translations
