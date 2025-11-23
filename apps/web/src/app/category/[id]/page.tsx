import { CategoryDetail } from '../../../components/category/CategoryDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryDetail categoryId={params.id} />;
}
