import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSchema } from "@/schemas/todo.schema";
import api from "./api";

export const electricTodoCollection = createCollection(
	electricCollectionOptions({
		id: "sync-todos",
		shapeOptions: {
			url: "http://localhost:3001/v1/shape",
			offset: "-1",
			params: {
				table: "todos",
			},
		},
		getKey: (item) => item.id,
		schema: todoSchema,
		onInsert: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			await api.request("/todos", "POST", mutation.modified);
			console.log("Inserting todo:", mutation.modified);
		},
		onDelete: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			await api.request("/todos", "DELETE", { id: mutation.original.id });
			console.log("Deleting todo:", mutation.original);
		},
		onUpdate: async ({ transaction }) => {
			const mutation = transaction.mutations[0];
			await api.request("/todos", "PUT", mutation.modified);
			console.log("Updating todo:", mutation.modified);
		},
	}),
);
