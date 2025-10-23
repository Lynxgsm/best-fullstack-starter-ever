import { useAllCategoriesQuery } from '@bfse/server'
import { Badge } from '@/components/ui/badge';

export default function App() {
  const { data, loading, error } = useAllCategoriesQuery();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className='text-2xl font-bold'>Hello World</h1>
      <ul className='flex flex-wrap gap-2'>
        {data?.allCategories?.nodes.map((category) => (
          <li key={category?.id}>
            <Badge variant='outline'>
              {category?.name}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}