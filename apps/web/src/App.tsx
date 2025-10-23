import { useAllCategoriesQuery } from '@bfse/server'

export default function App() {
  const { data, loading, error } = useAllCategoriesQuery();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}