import { redirect } from "next/navigation";

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/resource-details?id=${id}`);
}
