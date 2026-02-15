import { Pathnames, LocalePrefix } from 'next-intl/routing';

export const defaultLocale = 'ko' as const;
export const locales = ['ko', 'en', 'ja', 'zh'] as const;

export type Locale = (typeof locales)[number]; // 로케일 타입 정의 , ()[] 이건 타입 추출 연산자 . 예를들면 locales 타입에서 number 타입을 추출해서 Locale 타입을 정의한다.

export const pathnames = {
  '/': '/',
  '/home': '/home',
  '/saju': '/saju',
  '/community': '/community',
  '/profile': '/profile',
} satisfies Pathnames<typeof locales>; // Pathnames 타입을 정의한다. 

export const localePrefix: LocalePrefix<typeof locales> = 'always';

export const port = process.env.PORT || 3000; // 포트 번호 정의
export const host = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : `http://localhost:${port}`; // 호스트 정의
