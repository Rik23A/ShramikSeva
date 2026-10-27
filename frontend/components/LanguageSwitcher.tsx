'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const t = useTranslations('LocaleSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <label className="relative inline-flex items-center text-foreground">
            <p className="sr-only">{t('label')}</p>
            <select
                defaultValue={locale}
                className="appearance-none bg-card hover:bg-accent/70 text-foreground border border-border/70 hover:border-border text-xs sm:text-sm font-medium py-1.5 sm:py-2 pl-3 pr-7 sm:pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="en" className="bg-popover text-popover-foreground">{t('en')}</option>
                <option value="hi" className="bg-popover text-popover-foreground">{t('hi')}</option>
                <option value="bn" className="bg-popover text-popover-foreground">{t('bn')}</option>
                <option value="te" className="bg-popover text-popover-foreground">{t('te')}</option>
                <option value="ta" className="bg-popover text-popover-foreground">{t('ta')}</option>
                <option value="mr" className="bg-popover text-popover-foreground">{t('mr')}</option>
                <option value="gu" className="bg-popover text-popover-foreground">{t('gu')}</option>
                <option value="kn" className="bg-popover text-popover-foreground">{t('kn')}</option>
                <option value="ml" className="bg-popover text-popover-foreground">{t('ml')}</option>
                <option value="pa" className="bg-popover text-popover-foreground">{t('pa')}</option>
                <option value="or" className="bg-popover text-popover-foreground">{t('or')}</option>
                <option value="as" className="bg-popover text-popover-foreground">{t('as')}</option>
            </select>
            <span className="pointer-events-none absolute right-2 flex items-center text-muted-foreground">
                <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </span>
        </label>
    );
}
