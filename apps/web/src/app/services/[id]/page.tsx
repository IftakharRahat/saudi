import ProductDetails from '@/components/product-details/ProductDetails';

type ServiceDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailsPage({ params }: ServiceDetailsRouteProps) {
  const { id } = await params;
  return <ProductDetails serviceId={id} />;
}
