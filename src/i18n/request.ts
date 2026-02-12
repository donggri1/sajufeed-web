import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // IMPORTANT: locale이 undefined인 경우 기본값 사용 (404 페이지 등에서 발생)
  const currentLocale = (locale || defaultLocale) as string;

  // 기본값 적용 후에도 유효하지 않으면 notFound
  if (!locales.includes(currentLocale as any)) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}/common.json`)).default,
  };
});