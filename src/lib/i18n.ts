export const LOCALES = ['zh', 'en'] as const;
export const SITE_TITLE = "Kele's Blog";

export type Locale = (typeof LOCALES)[number];

const localeCopy = {
	zh: {
		lang: 'zh-CN',
		siteDescription: '关于 FPGA、数字通信和工程主题的笔记。',
		navPosts: '文章',
		navTags: '标签',
		navAbout: '关于',
		heroIntro:
			'你好，我是 Kele。这里主要记录 FPGA、数字信号处理、通信系统以及一些相关技术主题。',
		heroDetail: '博客会逐步提供中文原文和英文译文。',
		allPostsTitle: `全部文章 | ${SITE_TITLE}`,
		allPostsDescription: '完整的博客文章归档。',
		postsPageTitle: (page: number) => `文章 - 第 ${page} 页 | ${SITE_TITLE}`,
		postsPageDescription: (page: number) => `博客归档第 ${page} 页。`,
		tagsDescription: '按标签浏览文章。',
		tagArchiveTitle: (tag: string) => `标签 ${tag} 下的文章 | ${SITE_TITLE}`,
		tagArchiveDescription: (tag: string) => `标签 ${tag} 的文章归档。`,
		postsLabel: (count: number) => `${count} 篇文章`,
		languageSwitch: 'English',
		languageSwitchLabel: 'Read this post in English',
		paginationLabel: '文章分页',
	},
	en: {
		lang: 'en',
		siteDescription: 'Notes on FPGA, communication systems, and engineering topics.',
		navPosts: 'Posts',
		navTags: 'Tags',
		navAbout: 'About',
		heroIntro:
			"Hi, I'm Kele. This site collects my posts on FPGA, digital signal processing, communication systems, and a few adjacent topics.",
		heroDetail: 'English translations will be added alongside the original Chinese posts over time.',
		allPostsTitle: `All Posts | ${SITE_TITLE}`,
		allPostsDescription: 'Complete archive of blog posts.',
		postsPageTitle: (page: number) => `Posts - Page ${page} | ${SITE_TITLE}`,
		postsPageDescription: (page: number) => `Page ${page} of the blog archive.`,
		tagsDescription: 'Browse posts by tag.',
		tagArchiveTitle: (tag: string) => `Posts tagged ${tag} | ${SITE_TITLE}`,
		tagArchiveDescription: (tag: string) => `Archive for tag ${tag}.`,
		postsLabel: (count: number) => `${count} ${count === 1 ? 'post' : 'posts'}`,
		languageSwitch: '中文',
		languageSwitchLabel: '阅读这篇文章的中文版',
		paginationLabel: 'Posts pagination',
	},
} as const;

export function isLocale(value: string | undefined): value is Locale {
	return value === 'zh' || value === 'en';
}

export function getLocaleCopy(locale: Locale) {
	return localeCopy[locale];
}

export function getSiteTitle() {
	return SITE_TITLE;
}

export function getTagsTitle(locale: Locale) {
	const copy = getLocaleCopy(locale);
	return `${copy.navTags} | ${SITE_TITLE}`;
}

export function getAlternateLocale(locale: Locale): Locale {
	return locale === 'zh' ? 'en' : 'zh';
}

export function getLanguageLabel(locale: Locale) {
	return getLocaleCopy(locale).languageSwitch;
}
