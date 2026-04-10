import type { Metadata } from 'next';
import ServicesPage from '@/components/services/ServicesPage';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('services', 'Our Services — Future Companies', 'Explore our services');
}

export default function Page() {
  return (
    <>
      <JsonLd slug="services" />
      <ServicesPage />
    </>
  );
}