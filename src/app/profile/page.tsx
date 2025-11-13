import { redirect } from "next/navigation";
import { getAccounts } from "@/actions/get-accounts";
import { getCurrentSession } from "@/actions/get-session";
import UserRepos from "@/components/user-repos";
import AccountLinking from "./_components/account-linking";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  const accounts = await getAccounts();
  const nonCredentialsAccounts = accounts.filter(
    (a) => a.providerId !== "credential",
  );
  console.log("nonCredentialsAccounts:", nonCredentialsAccounts);
  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Profile</h1>
      <AccountLinking accounts={nonCredentialsAccounts} />

      <UserRepos />

      <section>
        <h3>This is your session:</h3>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </section>
    </div>
  );

  // Request additional scopes
  // https://www.better-auth.com/docs/concepts/oauth#requesting-additional-scopes
}
