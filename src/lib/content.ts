import type { CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type BlogCollection = 'blogZh' | 'blogEn';
export type BlogPost = CollectionEntry<'blogZh'> | CollectionEntry<'blogEn'>;
export type PageCollection = 'pagesZh' | 'pagesEn';
export type PageEntry = CollectionEntry<'pagesZh'> | CollectionEntry<'pagesEn'>;

export const PAGE_SIZE = 10;

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

export function mapPostSummary(post: BlogPost) {
	return {
		title: post.data.title,
		date: post.data.date,
		slug: post.data.slug,
		tags: post.data.tags ?? [],
		locale: post.data.locale,
	};
}

export async function getPostRouteEntries(locale: Locale) {
	if (locale === 'zh') {
		return (await getPostsByLocale('zh')).map((post) => ({ slug: post.data.slug, post }));
	}

	const [englishPosts, chinesePosts] = await Promise.all([
		getPostsByLocale('en'),
		getPostsByLocale('zh'),
	]);
	const postsBySlug = new Map(chinesePosts.map((post) => [post.data.slug, post]));

	for (const post of englishPosts) {
		postsBySlug.set(post.data.slug, post);
	}

	return [...postsBySlug.entries()].map(([slug, post]) => ({ slug, post }));
}
