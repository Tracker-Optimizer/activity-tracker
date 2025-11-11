import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex justify-center gap-4">
      <Button asChild>
        <Link href="/signin">Sign In</Link>
      </Button>

      <Button variant="secondary" asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </section>
  );
}
