import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/get-session";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/signin");
  }

  return <div>Dashboard</div>;
}
