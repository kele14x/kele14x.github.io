import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
	layout: z.string().optional(),
	title: z.string(),
	date: z.coerce.date(),
	slug: z.string(),
	locale: z.enum(['zh', 'en']),
	tags: z.array(z.string()).optional(),
	description: z.string().optional(),
});

const pageSchema = z.object({
	title: z.string(),
	description: z.string(),
	slug: z.string(),
	locale: z.enum(['zh', 'en']),
});

const blogZh = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog/zh' }),
	schema: blogSchema,
});

const blogEn = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog/en' }),
	schema: blogSchema,
});

const pagesZh = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/site/zh' }),
	schema: pageSchema,
});

const pagesEn = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/site/en' }),
	schema: pageSchema,
});

export const collections = { blogZh, blogEn, pagesZh, pagesEn };
