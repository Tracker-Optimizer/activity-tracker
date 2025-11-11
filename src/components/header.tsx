import Link from "next/link";
import { getCurrentSession } from "@/actions/get-session";
import { Button } from "@/components/ui/button";
import UserMenu from "./user-menu";

export default async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="flex justify-between items-center px-6 py-2">
      <h1>Tracker Optimizer</h1>

      <aside className="flex gap-2">
        {session ? (
          <UserMenu user={session.user} />
        ) : (
          <>
            <Button asChild>
              <Link href="/signin">Sign In</Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </aside>
    </header>
  );
}
