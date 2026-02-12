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
  console.log('========== [LOCALE] LAYOUT DEBUG ==========');
  // IMPORTANT: Next.js 15+에서는 params를 console.log에 직접 전달하면 안됨!
  // await 후에만 사용 가능
  
  const { locale } = await params;
  
  console.log('[1] locale (after await):', locale);
  console.log('[2] valid locales:', routing.locales);
  console.log('[3] is valid?:', routing.locales.includes(locale as any));
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    console.log('[4] ❌ Invalid locale! Calling notFound()');
    notFound();
  }

  console.log('[5] ✅ Valid locale, loading messages...');
  console.log('[6] getMessages에 전달할 locale:', locale);
  
  // Providing all messages to the client
  // IMPORTANT: getMessages()에 명시적으로 locale 전달
  const messages = await getMessages({ locale });
  
  console.log('[7] ✅ Messages loaded, keys:', Object.keys(messages));
  console.log('==========================================\n');
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
