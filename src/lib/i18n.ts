export const LOCALES = ['ru', 'uz', 'en'] as const;
export type Locale = typeof LOCALES[number];

export const translations = {
  ru: {
    app: {
      loading: 'Загрузка Neuropul...',
      openInBrowser: 'Открыть в браузере',
      telegramWarning: '⚠️ Для полного функционала откройте через Telegram'
    },
    premium: {
      title: 'Премиум-доступ',
      description: 'Откройте полный потенциал Neuropul',
      perMonth: 'в месяц',
      subscribe: 'Подписаться',
      features: {
        unlimitedCoach: 'Безлимитный AI-коучинг',
        advancedTools: 'Расширенные инструменты',
        prioritySupport: 'Приоритетная поддержка'
      }
    },
    coach: {
      title: 'AI-Коуч',
      placeholder: 'Задайте ваш вопрос...',
      send: 'Отправить'
    },
    dashboard: {
      title: 'Панель управления',
      xp: 'Опыт',
      level: 'Уровень'
    }
  },
  uz: {
    app: {
      loading: "Neuropul yuklanmoqda...",
      openInBrowser: "Brauzerda ochish",
      telegramWarning: "⚠️ To'liq funksiyalar uchun Telegram orqali oching"
    },
    premium: {
      title: 'Premium kirish',
      description: "Neuropul'ning to'liq imkoniyatlarini oching",
      perMonth: 'oyiga',
      subscribe: 'Obuna bo\'lish',
      features: {
        unlimitedCoach: 'Cheksiz AI-kouching',
        advancedTools: 'Kengaytirilgan vositalar',
        prioritySupport: 'Ustuvor qo\'llab-quvvatlash'
      }
    },
    coach: {
      title: 'AI-Kouch',
      placeholder: 'Savolingizni bering...',
      send: 'Yuborish'
    },
    dashboard: {
      title: 'Boshqaruv paneli',
      xp: 'Tajriba',
      level: 'Daraja'
    }
  },
  en: {
    app: {
      loading: 'Loading Neuropul...',
      openInBrowser: 'Open in browser',
      telegramWarning: '⚠️ For full functionality, open via Telegram'
    },
    premium: {
      title: 'Premium Access',
      description: 'Unlock full Neuropul potential',
      perMonth: 'per month',
      subscribe: 'Subscribe',
      features: {
        unlimitedCoach: 'Unlimited AI coaching',
        advancedTools: 'Advanced tools',
        prioritySupport: 'Priority support'
      }
    },
    coach: {
      title: 'AI Coach',
      placeholder: 'Ask your question...',
      send: 'Send'
    },
    dashboard: {
      title: 'Dashboard',
      xp: 'Experience',
      level: 'Level'
    }
  }
};

export function useLocale(): Locale {
  const tg = (window as any).Telegram?.WebApp;
  const tgLang = tg?.initDataUnsafe?.user?.language_code;

  if (tgLang === 'ru') return 'ru';
  if (tgLang === 'uz') return 'uz';
  return 'uz';
}

export function formatUZS(minor: number, locale: Locale = 'uz'): string {
  const major = minor / 100;

  const formatted = new Intl.NumberFormat(
    locale === 'uz' ? 'uz-UZ' : 'ru-RU',
    {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).format(major);

  const suffix = locale === 'uz' ? " so'm" : locale === 'ru' ? ' сум' : ' UZS';
  return formatted + suffix;
}

export function formatCurrency(minor: number, currency: string, locale: Locale = 'uz'): string {
  if (currency.toUpperCase() === 'UZS') {
    return formatUZS(minor, locale);
  }

  const major = minor / 100;
  return new Intl.NumberFormat(
    locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US',
    {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(major);
}
