import { DashboardScreen } from "@/features/dashboard/components/dashboard-screen";

export const dynamic = "force-dynamic";

export default async function Home() {
  return await DashboardScreen();
}
