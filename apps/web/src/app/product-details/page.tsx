import { redirect } from 'next/navigation';
import ProductDetails from '@/components/product-details/ProductDetails';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const firstProduct = await prisma.product.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (firstProduct) {
    redirect(`/product-details/${firstProduct.id}`);
  }

  return <ProductDetails />;
}
