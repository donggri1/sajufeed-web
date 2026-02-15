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

  const common = (await import(`./messages/${currentLocale}/common.json`)).default;

  // 로드할 개별 모듈 목록
  const modules = [
    'profile', 'fortune', 'home', 'daily', 'saju',
    'tojeong', 'new-year', 'compatibility', 'pick-date',
    'name-saju', 'dream', 'footer', 'navigation', 'auth', 'manse'
  ];

  const messages: Record<string, any> = { ...common };

  for (const moduleName of modules) {
    try {
      const moduleContent = (await import(`./messages/${currentLocale}/${moduleName}.json`)).default;

      // 만약 common에도 해당 네임스페이스가 있다면 병합, 아니면 새로 추가
      if (messages[moduleName]) {
        messages[moduleName] = { ...messages[moduleName], ...moduleContent };
      } else {
        messages[moduleName] = moduleContent;
      }
    } catch (error) {
      // 파일이 없을 경우 무시
    }
  }

  return {
    locale: currentLocale,
    messages: messages,
  };
});