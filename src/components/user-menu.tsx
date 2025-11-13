import type { User } from "better-auth";
import { CircleUserRoundIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "./logout-button";

export default function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <CircleUserRoundIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem>
          <Button variant="link" asChild>
            <Link href="/profile">Profile</Link>
          </Button>
        </DropdownMenuItem>

        {user ? (
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
