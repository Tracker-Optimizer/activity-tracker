"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export default function LogoutButton() {
  const { logout, isLoading } = useLogout();

  return (
    <Button variant="link" onClick={logout} disabled={isLoading}>
      Logout
    </Button>
  );
}
