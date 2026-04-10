import type { Metadata } from 'next';
import ProductDetails from '@/components/product-details/ProductDetails';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

type ServiceDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ServiceDetailsRouteProps): Promise<Metadata> {
  const { id } = await params;
  return buildPageMetadata(`services/${id}`, 'Service Details — Future Companies');
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsRouteProps) {
  const { id } = await params;
  return (
    <>
      <JsonLd slug={`services/${id}`} />
      <ProductDetails serviceId={id} />
    </>
  );
}
