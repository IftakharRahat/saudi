import type { Metadata } from 'next';
import ProductDetails from '@/components/product-details/ProductDetails';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

type ProductDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductDetailsRouteProps): Promise<Metadata> {
  const { id } = await params;
  return buildPageMetadata(`product-details/${id}`, 'Product Details — Future Companies');
}

export default async function ProductDetailsByIdPage({ params }: ProductDetailsRouteProps) {
  const { id } = await params;
  return (
    <>
      <JsonLd slug={`product-details/${id}`} />
      <ProductDetails productId={id} />
    </>
  );
}
