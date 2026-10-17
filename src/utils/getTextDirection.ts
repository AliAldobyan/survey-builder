// Use the first letter so numbers and punctuation do not determine direction.
export function getTextDirection(text: string, fallback: 'ltr' | 'rtl' = 'ltr'): 'ltr' | 'rtl' {
  const firstLetter = text.match(/\p{L}/u)?.[0]
  if (!firstLetter) return fallback
  return /[\p{Script=Arabic}\p{Script=Hebrew}]/u.test(firstLetter) ? 'rtl' : 'ltr'
}
