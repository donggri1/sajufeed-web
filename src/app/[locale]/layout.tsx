import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() { // generateStaticParams 함수를 사용하여 정적 파라미터를 생성한다.
  return routing.locales.map((locale) => ({ locale })); // routing.locales 타입을 정의한다. 예를들면 ['ko', 'en', 'ja', 'zh'] 이라면 [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }] 이라고 표시한다.
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // IMPORTANT: getMessages()에 명시적으로 locale 전달
  const messages = await getMessages({ locale });
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
