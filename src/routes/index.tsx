import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import TodoApp from "@/components/TodoApp.tsx";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
			<h1 className="text-3xl font-bold mb-8">Todo App</h1>
			{isClient ? (
				<TodoApp />
			) : (
				<div className="text-gray-400">Loading client...</div>
			)}
		</div>
	);
}
