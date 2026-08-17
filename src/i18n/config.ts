export const locales = ['ar', 'am', 'sw', 'shi', 'kab', 'tmh', 'mas'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  am: 'አማርኛ',
  sw: 'Kiswahili',
  shi: 'Tashelhit',
  kab: 'Taqbaylit',
  tmh: 'Tamasheq',
  mas: 'Maa',
};

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  am: 'ltr',
  sw: 'ltr',
  shi: 'ltr',
  kab: 'ltr',
  tmh: 'ltr',
  mas: 'ltr',
};
