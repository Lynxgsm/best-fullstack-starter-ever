import { useLiveQuery } from "@tanstack/react-db";
import { Trash } from "lucide-react";
import { useId } from "react";
import { electricTodoCollection } from "@/lib/collections";

function TodoApp() {
	const todoInputId = useId();

	const { data, isLoading } = useLiveQuery((query) =>
		query.from({ todo: electricTodoCollection }).select(({ todo }) => ({
			id: todo.id,
			text: todo.text,
			completed: todo.completed,
		})),
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const todo = formData.get("todo") as string;

		if (!todo.trim()) {
			return;
		}

		try {
			const newTodo = {
				id: crypto.randomUUID(),
				text: todo.trim(),
				completed: false,
			};

			electricTodoCollection.insert(newTodo);
			// Reset the form after successful insertion
			(e.target as HTMLFormElement).reset();
		} catch (error) {
			console.error("Error adding todo:", error);
		}
	};

	const handleComplete = async (id: string) => {
		const todo = data?.find((t) => t.id === id);
		if (todo) {
			electricTodoCollection.update(todo.id, (draft) => {
				draft.completed = true;
			});
		}
	};

	const handleDelete = async (id: string) => {
		electricTodoCollection.delete(id);
	};

	if (isLoading) {
		return <div className="text-gray-400">Loading...</div>;
	}

	return (
		<div className="w-full max-w-md">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
				<label htmlFor={todoInputId} className="text-sm font-medium">
					Add a new todo:
				</label>
				<div className="flex gap-2">
					<input
						type="text"
						name="todo"
						id={todoInputId}
						placeholder="Enter todo..."
						className="flex-1 bg-transparent border border-gray-600 rounded-md p-3 focus:border-white focus:outline-none"
						required
					/>
					<button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-colors"
					>
						Add
					</button>
				</div>
			</form>

			<div className="space-y-2">
				<h2 className="text-xl font-semibold mb-4">
					Todos ({data?.length || 0})
				</h2>
				{data && data.length > 0 ? (
					<ul className="space-y-2">
						{data.map((todo) => (
							<li
								key={todo.id}
								className={`flex items-center justify-between p-3 border border-gray-600 rounded-md ${
									todo.completed ? "opacity-50 line-through" : ""
								}`}
							>
								<div className="flex items-center">
									<input
										type="checkbox"
										onChange={() => handleComplete(todo.id)}
										checked={todo.completed}
									/>
									<span className="ml-2">{todo.text}</span>
								</div>
								<button
									type="button"
									className="hover:text-red-500 cursor-pointer"
									onClick={() => handleDelete(todo.id)}
								>
									<Trash className="w-4 h-4" />
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-400 text-center py-8">
						No todos yet. Add one above!
					</p>
				)}
			</div>
		</div>
	);
}

export default TodoApp;
