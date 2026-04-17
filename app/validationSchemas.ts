import { z } from 'zod';

export const createIssueSchema = z.object({
    title: z.string().min(1, "Title is required.").max(255),
    description: z.string().min(1, "Description is required."),
    system: z.string().min(1, "System is required.").max(255),
    category: z.string().min(1, "Category is required.").max(255),
});