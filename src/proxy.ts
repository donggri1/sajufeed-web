import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  
  console.log('========== PROXY.TS DEBUG ==========');
  console.log('[1] 요청 URL:', pathname + search);
  console.log('[2] 요청 메서드:', req.method);
  console.log('[3] 요청 헤더 (accept-language):', req.headers.get('accept-language'));
  
  // next-intl 처리 (locale 리다이렉트)
  const response = intlMiddleware(req);
  
  console.log('[4] intlMiddleware 응답 상태:', response.status);
  console.log('[5] 리다이렉트 위치:', response.headers.get('location') || '없음');
  console.log('====================================\n');
  
  return response;
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
