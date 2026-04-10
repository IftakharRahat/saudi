import type { Metadata } from 'next';
import AboutPage from '@/components/about/AboutPage';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('about', 'About Us — Future Companies', 'Learn about Future Companies');
}

export default function Page() {
  return (
    <>
      <JsonLd slug="about" />
      <AboutPage />
    </>
  );
}