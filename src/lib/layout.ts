import { getLanguageLabel, getLocaleCopy, type Locale } from './i18n';
import {
	getAboutPath,
	getPaginatedPostsPath,
	getPostsIndexPath,
	getTagsIndexPath,
} from './paths';

export function buildLayoutProps(locale: Locale) {
	const copy = getLocaleCopy(locale);

	return {
		copy,
		homeHref: getPaginatedPostsPath(locale, 1),
		postsHref: getPostsIndexPath(locale),
		tagsHref: getTagsIndexPath(locale),
		aboutHref: getAboutPath(locale),
		languageLabel: getLanguageLabel(locale),
		navLabels: {
			posts: copy.navPosts,
			tags: copy.navTags,
			about: copy.navAbout,
		},
	};
}
