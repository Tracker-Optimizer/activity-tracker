"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function getAccessToken(
  providerId: "github" | "google" | "discord",
) {
  try {
    const result = await auth.api.getAccessToken({
      body: {
        providerId,
      },
      headers: await headers(),
    });
    return result;
  } catch (error) {
    console.error(`Failed to get access token for ${providerId}:`, error);
    return { accessToken: null };
  }
}
