import 'server-only'
import type { Locale } from '@/i18n/i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
    vi: () => import('@/dictionary/vi.json').then((module) => module.default),
    en: () => import('@/dictionary/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.vi()
