import type { Metadata } from 'next';
import LandingPage from '@/components/landing-page/LandingPage';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('home', 'Future Companies', 'Used Furniture Saudi');
}

export default function Page() {
  return (
    <>
      <JsonLd slug="home" />
      <LandingPage />
    </>
  );
}