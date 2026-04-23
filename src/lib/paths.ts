import type { Locale } from './i18n';

export function getLocaleBasePath(locale: Locale) {
	return `/${locale}`;
}

export function getPostPath(locale: Locale, slug: string) {
	return `${getLocaleBasePath(locale)}/${slug}/`;
}

export function getPostsIndexPath(locale: Locale) {
	return `${getLocaleBasePath(locale)}/posts/`;
}

export function getPaginatedPostsPath(locale: Locale, page: number) {
	if (page === 1) {
		return `${getLocaleBasePath(locale)}/`;
	}

	return `${getLocaleBasePath(locale)}/page/${page}/`;
}

export function getTagsIndexPath(locale: Locale) {
	return `${getLocaleBasePath(locale)}/tags/`;
}

export function getTagPath(locale: Locale, tag: string) {
	return `${getLocaleBasePath(locale)}/tags/${tag.toLowerCase()}/`;
}

export function getAboutPath(locale: Locale) {
	return `${getLocaleBasePath(locale)}/about/`;
}
