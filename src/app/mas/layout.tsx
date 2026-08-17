import LangLayout from '@/components/i18n/LangLayout';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <LangLayout lang="mas">{children}</LangLayout>;
}
