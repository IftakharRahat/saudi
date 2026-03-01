import ServiceDetails from '@/components/services/ServiceDetails';

type ServiceDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailsPage({ params }: ServiceDetailsRouteProps) {
  const { id } = await params;
  return <ServiceDetails serviceId={id} />;
}
