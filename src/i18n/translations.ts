export const translations = {
  en: {
    surveyConfiguration: 'Survey configuration',
    surveyBuilder: 'Survey Builder',
    description: 'Create and configure a building survey.',
    switchLanguage: 'العربية',
    wizard: {
      settings: 'Survey Settings',
      questions: 'Questions',
      review: 'Review & Submit',
      settingsPlaceholder: 'Set the survey title, description, and confirmation message.',
      questionsPlaceholder: 'Add questions and enter survey responses.',
      reviewPlaceholder: 'Review the survey details before submitting.',
      previous: 'Previous',
      next: 'Next',
    },
  },
  ar: {
    surveyConfiguration: 'إعداد الاستبيان',
    surveyBuilder: 'منشئ الاستبيانات',
    description: 'أنشئ استبيان مبنى واضبط إعداداته.',
    switchLanguage: 'English',
    wizard: {
      settings: 'إعدادات الاستبيان',
      questions: 'الأسئلة',
      review: 'المراجعة والإرسال',
      settingsPlaceholder: 'أدخل عنوان الاستبيان ووصفه ورسالة التأكيد.',
      questionsPlaceholder: 'أضف الأسئلة وأدخل إجابات الاستبيان.',
      reviewPlaceholder: 'راجع تفاصيل الاستبيان قبل إرساله.',
      previous: 'السابق',
      next: 'التالي',
    },
  },
} as const

export type Language = keyof typeof translations

export type SurveyWizardText = {
  [Key in keyof typeof translations.en.wizard]: string
}
