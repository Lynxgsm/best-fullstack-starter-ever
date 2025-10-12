import { z } from "zod";

export const todoSchema = z.object({
	id: z.string(),
	text: z.string(),
	completed: z.boolean(),
});
