import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale, pathnames, localePrefix } from './config';

export const routing = defineRouting({ // defineRouting 함수를 사용하여 routing 객체를 생성한다.
  locales,
  defaultLocale,
  pathnames,
  localePrefix // localePrefix 타입을 정의한다. 
});

export const { Link, redirect, usePathname, useRouter } =
createNavigation(routing); // createNavigation 함수를 사용하여 Link, redirect, usePathname, useRouter 함수를 생성한다.
