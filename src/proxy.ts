import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  // next-intl 처리 (locale 리다이렉트)
  return intlMiddleware(req); // intlMiddleware 함수를 사용하여 미들웨어를 실행한다.
}

export const config = {
  // Match only internationalized pathnames
  // IMPORTANT: locale 없는 모든 경로를 캐치하여 리다이렉트
  matcher: [
    // locale 없는 경로 (api, _next, static 제외)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // locale 있는 경로
    '/(ko|en|ja|zh)/:path*'
  ]
};
