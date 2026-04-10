import type { Metadata } from 'next';
import ContactPage from '@/components/contact/ContactPage';
import JsonLd from '@/components/seo/JsonLd';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('contact', 'Contact Us — Future Companies', 'Get in touch with Future Companies');
}

export default function Page() {
  return (
    <>
      <JsonLd slug="contact" />
      <ContactPage />
    </>
  );
}