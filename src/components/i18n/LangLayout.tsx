import { Locale, localeDirections } from '@/i18n/config';

export default function LangLayout({ children, lang }: { children: React.ReactNode, lang: Locale }) {
  const dir = localeDirections[lang] || 'ltr';
  return (
    <div lang={lang} dir={dir} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
