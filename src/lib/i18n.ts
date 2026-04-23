export const LOCALES = ['zh', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

const localeCopy = {
	zh: {
		lang: 'zh-CN',
		siteTitle: "Kele's Blog",
		siteDescription: '关于 FPGA、数字通信和工程主题的笔记。',
		navPosts: '文章',
		navTags: '标签',
		navAbout: '关于',
		heroEyebrow: '工程笔记与长文整理',
		heroIntro:
			'你好，我是 Kele。这里主要记录 FPGA、数字信号处理、通信系统以及一些相关技术主题。',
		heroDetail: '博客会逐步提供中文原文和英文译文。',
		allPostsTitle: '全部文章 | Kele\'s Blog',
		allPostsDescription: '完整的博客文章归档。',
		postsPageTitle: (page: number) => `文章 - 第 ${page} 页 | Kele's Blog`,
		postsPageDescription: (page: number) => `博客归档第 ${page} 页。`,
		tagsTitle: '标签 | Kele\'s Blog',
		tagsDescription: '按标签浏览文章。',
		tagArchiveTitle: (tag: string) => `标签 ${tag} 下的文章 | Kele's Blog`,
		tagArchiveDescription: (tag: string) => `标签 ${tag} 的文章归档。`,
		postsLabel: (count: number) => `${count} 篇文章`,
		languageSwitch: 'English',
		languageSwitchLabel: 'Read this post in English',
		homeDescription: '关于 FPGA、编程和通信系统的笔记。',
		paginationLabel: '文章分页',
	},
	en: {
		lang: 'en',
		siteTitle: "Kele's Blog",
		siteDescription: 'Notes on FPGA, communication systems, and engineering topics.',
		navPosts: 'Posts',
		navTags: 'Tags',
		navAbout: 'About',
		heroEyebrow: 'Engineering notes and long-form writeups',
		heroIntro:
			"Hi, I'm Kele. This site collects my posts on FPGA, digital signal processing, communication systems, and a few adjacent topics.",
		heroDetail: 'English translations will be added alongside the original Chinese posts over time.',
		allPostsTitle: 'All Posts | Kele\'s Blog',
		allPostsDescription: 'Complete archive of blog posts.',
		postsPageTitle: (page: number) => `Posts - Page ${page} | Kele's Blog`,
		postsPageDescription: (page: number) => `Page ${page} of the blog archive.`,
		tagsTitle: 'Tags | Kele\'s Blog',
		tagsDescription: 'Browse posts by tag.',
		tagArchiveTitle: (tag: string) => `Posts tagged ${tag} | Kele's Blog`,
		tagArchiveDescription: (tag: string) => `Archive for tag ${tag}.`,
		postsLabel: (count: number) => `${count} ${count === 1 ? 'post' : 'posts'}`,
		languageSwitch: '中文',
		languageSwitchLabel: '阅读这篇文章的中文版',
		homeDescription: 'Notes on FPGA, coding, and communication systems.',
		paginationLabel: 'Posts pagination',
	},
} as const;

export function isLocale(value: string | undefined): value is Locale {
	return value === 'zh' || value === 'en';
}

export function getLocaleCopy(locale: Locale) {
	return localeCopy[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
	return locale === 'zh' ? 'en' : 'zh';
}

export function getLanguageLabel(locale: Locale) {
	return getLocaleCopy(locale).languageSwitch;
}
