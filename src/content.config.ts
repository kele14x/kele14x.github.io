import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		layout: z.string().optional(),
		title: z.string(),
		date: z.coerce.date(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
	}),
});

export const collections = { blog };
