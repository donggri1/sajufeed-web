"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    
    return (
        <footer className="border-t bg-slate-50">
            <div className="container px-4 md:px-8 py-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {tNav('appName').toUpperCase()}
                        </span>
                        <p className="mt-4 text-sm text-slate-500 max-w-xs">
                            {t('description')}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{t('services')}</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/daily" className="text-sm text-slate-600 hover:text-indigo-600">{tNav('daily')}</Link></li>
                            <li><Link href="/saju" className="text-sm text-slate-600 hover:text-indigo-600">{tNav('saju')}</Link></li>
                            <li><Link href="/tojeong" className="text-sm text-slate-600 hover:text-indigo-600">{tNav('tojeong')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{t('support')}</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/notice" className="text-sm text-slate-600 hover:text-indigo-600">{t('notice')}</Link></li>
                            <li><Link href="/faq" className="text-sm text-slate-600 hover:text-indigo-600">{t('faq')}</Link></li>
                            <li><Link href="/contact" className="text-sm text-slate-600 hover:text-indigo-600">{t('contact')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8">
                    <p className="text-sm text-slate-400 text-center">
                        {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
