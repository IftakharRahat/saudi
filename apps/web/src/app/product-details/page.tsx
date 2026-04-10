import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ProductDetails from '@/components/product-details/ProductDetails';
import JsonLd from '@/components/seo/JsonLd';
import { prisma } from '@/lib/prisma';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('products', 'Products — Future Companies', 'Browse our products');
}

export default async function Page() {
  const firstProduct = await prisma.product.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (firstProduct) {
    redirect(`/product-details/${firstProduct.id}`);
  }

  return (
    <>
      <JsonLd slug="products" />
      <ProductDetails />
    </>
  );
}
