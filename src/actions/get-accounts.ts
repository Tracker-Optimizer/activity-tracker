"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function getAccounts() {
  return auth.api.listUserAccounts({
    headers: await headers(),
  });
}
