import type { InferSchemaOutput } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import pg from "pg";
import { env } from "@/env";
import type { todoSchema } from "@/schemas/todo.schema";

const DATABASE_URL =
	env.DATABASE_URL || `postgresql://postgres:password@localhost:54321/electric`;
const pool = new pg.Pool({ connectionString: DATABASE_URL });

type Todo = InferSchemaOutput<typeof todoSchema>;

const createTodo = async (todo: Todo) => {
	const sql = `
    INSERT INTO todos (text, completed)
    VALUES ($1, $2)
  `;

	const params = [todo.text, todo.completed];

	await pool.query(sql, params);
};

const deleteTodo = async (id: string) => {
	const sql = `
    DELETE FROM todos WHERE id = $1
  `;
	const params = [id];
	await pool.query(sql, params);
};

const updateTodo = async (todo: Todo) => {
	const sql = `
    UPDATE todos SET completed = $1 WHERE id = $2
  `;
	const params = [todo.completed, todo.id];
	await pool.query(sql, params);
};

export const Route = createFileRoute("/api/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					await createTodo(body);
					return new Response(JSON.stringify({ success: true }), {
						status: 201,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error inserting todo:", error);
					return new Response(JSON.stringify({ success: false }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
			PUT: async ({ request }) => {
				try {
					const body = await request.json();
					await updateTodo(body);
					return new Response(JSON.stringify({ success: true }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error updating todo:", error);
					return new Response(JSON.stringify({ success: false }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
			DELETE: async ({ request }) => {
				try {
					const body = await request.json();
					await deleteTodo(body.id);
					return new Response(JSON.stringify({ success: true }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error deleting todo:", error);
					return new Response(JSON.stringify({ success: false }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
