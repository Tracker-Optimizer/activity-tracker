import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions/get-session";

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/signin");
  }

  return <div>Profile</div>;
}
