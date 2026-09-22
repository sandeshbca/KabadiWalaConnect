import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Role } from "@/lib/types";
const routeRoles: Record<string, Role> = {
  citizen: "Citizen",
  collector: "Collector",
  recycler: "Recycler",
  admin: "Admin",
};
export default async function RoleDashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const selectedRole = routeRoles[role];
  if (!selectedRole) notFound();
  return <DashboardShell role={selectedRole} />;
}
