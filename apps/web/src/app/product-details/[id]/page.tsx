import ProductDetails from '@/components/product-details/ProductDetails';

type ProductDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsByIdPage({ params }: ProductDetailsRouteProps) {
  const { id } = await params;
  return <ProductDetails productId={id} />;
}
