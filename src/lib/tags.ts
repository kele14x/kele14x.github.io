import type { BlogPost } from './content';
import { getPostsByLocale } from './content';
import type { Locale } from './i18n';

export async function hasTagPosts(tag: string, locale: Locale) {
	return (await getPostsByLocale(locale)).some((post) =>
		(post.data.tags ?? []).some((item) => item.toLowerCase() === tag.toLowerCase()),
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
