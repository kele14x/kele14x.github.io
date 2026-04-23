import type { CollectionEntry } from 'astro:content';

export type Locale = 'zh' | 'en';
export type BlogCollection = 'blogZh' | 'blogEn';
export type BlogPost = CollectionEntry<'blogZh'> | CollectionEntry<'blogEn'>;
export type PageCollection = 'pagesZh' | 'pagesEn';
export type PageEntry = CollectionEntry<'pagesZh'> | CollectionEntry<'pagesEn'>;

export const PAGE_SIZE = 10;

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

export function getLocaleCopy(locale: Locale) {
	return localeCopy[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
	return locale === 'zh' ? 'en' : 'zh';
}

export function getLanguageLabel(locale: Locale) {
	return getLocaleCopy(locale).languageSwitch;
}

export function getLocaleBasePath(locale: Locale) {
	return `/${locale}`;
}

export function getPostPath(locale: Locale, slug: string) {
	return `${getLocaleBasePath(locale)}/${slug}/`;
}

export function getPostsIndexPath(locale: Locale) {
	const base = getLocaleBasePath(locale);
	return base ? `${base}/posts/` : '/posts/';
}

export function getPaginatedPostsPath(locale: Locale, page: number) {
	if (page === 1) {
		return `${getLocaleBasePath(locale)}/`;
	}

	const base = getLocaleBasePath(locale);
	return `${base}/page/${page}/`;
}

export function getTagsIndexPath(locale: Locale) {
	const base = getLocaleBasePath(locale);
	return base ? `${base}/tags/` : '/tags/';
}

export function getTagPath(locale: Locale, tag: string) {
	const base = getLocaleBasePath(locale);
	return `${base}/tags/${tag.toLowerCase()}/`;
}

export function getAboutPath(locale: Locale) {
	return `${getLocaleBasePath(locale)}/about/`;
}

export function getCollectionName(locale: Locale): BlogCollection {
	return locale === 'zh' ? 'blogZh' : 'blogEn';
}

export function getPageCollectionName(locale: Locale): PageCollection {
	return locale === 'zh' ? 'pagesZh' : 'pagesEn';
}

export async function getPostsByLocale(locale: Locale) {
	const { getCollection } = await import('astro:content');
	return (await getCollection(getCollectionName(locale))).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
}

export async function getArchivePageCount(locale: Locale) {
	return Math.ceil((await getPostsByLocale(locale)).length / PAGE_SIZE);
}

export async function getPageBySlug(locale: Locale, slug: string) {
	const { getCollection } = await import('astro:content');
	return (await getCollection(getPageCollectionName(locale))).find((page) => page.data.slug === slug);
}

export async function getPostTranslation(slug: string, locale: Locale) {
	return (await getPostsByLocale(locale)).find((post) => post.data.slug === slug);
}

export async function hasTagPosts(tag: string, locale: Locale) {
	return (await getPostsByLocale(locale)).some((post) =>
		(post.data.tags ?? []).some((item) => item.toLowerCase() === tag.toLowerCase()),
	);
}

export function mapPostSummary(post: BlogPost) {
	return {
		title: post.data.title,
		date: post.data.date,
		slug: post.data.slug,
		tags: post.data.tags ?? [],
		locale: post.data.locale,
	};
}

export function findTranslation(posts: BlogPost[], post: BlogPost, locale: Locale) {
	return posts.find(
		(candidate) => candidate.data.slug === post.data.slug && candidate.data.locale === locale,
	);
}

export function buildTagMap(posts: BlogPost[]) {
	const tagMap = new Map<string, { label: string; count: number }>();

	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			const slug = tag.toLowerCase();
			const existing = tagMap.get(slug);

			if (existing) {
				existing.count += 1;
				continue;
			}

			tagMap.set(slug, { label: tag, count: 1 });
		}
	}

	return [...tagMap.entries()]
		.map(([slug, data]) => ({ slug, ...data }))
		.sort((a, b) => a.slug.localeCompare(b.slug));
}
