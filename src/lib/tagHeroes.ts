import type { Locale } from './i18n';

interface TagHero {
	zh: { intro: string; detail: string };
	en: { intro: string; detail: string };
	image?: string;
}

const tagHeroes: Record<string, TagHero> = {
	ptp: {
		zh: {
			intro: 'PTP（Precision Time Protocol）系列文章，讨论精确时间同步协议的原理与实践。',
			detail: '',
		},
		en: {
			intro: 'A series on Precision Time Protocol (PTP) — exploring the principles and practice of precise time synchronization.',
			detail: '',
		},
	},
};

export function getTagHero(tag: string, locale: Locale) {
	const hero = tagHeroes[tag.toLowerCase()];
	if (!hero) return undefined;
	return { ...hero[locale], image: hero.image };
}
