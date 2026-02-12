import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  console.log('========== I18N REQUEST.TS DEBUG ==========');
  console.log('[1] getRequestConfig 호출됨');
  console.log('[2] locale:', locale);
  console.log('[3] locale 타입:', typeof locale);
  
  // IMPORTANT: locale이 undefined인 경우 기본값 사용 (404 페이지 등에서 발생)
  const currentLocale = (locale || defaultLocale) as string;

  console.log('[4] currentLocale (with default):', currentLocale);
  console.log('[5] valid locales:', locales);
  console.log('[6] is valid?:', locales.includes(currentLocale as any));

  // 기본값 적용 후에도 유효하지 않으면 notFound
  if (!locales.includes(currentLocale as any)) {
    console.log('[7] ❌ Invalid locale! Calling notFound()');
    notFound();
  }

  console.log('[8] ✅ Valid locale, loading messages...');
  console.log('[9] 메시지 경로:', `./messages/${currentLocale}/common.json`);

  try {
    const messages = (await import(`./messages/${currentLocale}/common.json`)).default;
    console.log('[10] ✅ Messages loaded successfully');
    console.log('[11] Message keys:', Object.keys(messages));
    console.log('=========================================\n');
    
    return {
      locale: currentLocale,
      messages,
    };
  } catch (error) {
    console.log('[10] ❌ Failed to load messages!');
    console.error('[11] Error:', error);
    console.log('=========================================\n');
    throw error;
  }
});