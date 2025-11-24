import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { callMCPTool } from "@/lib/mcp/client";
import { extractSessionToken } from "@/lib/mcp/session-token";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // 1. Authenticate the user
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Get session cookie to forward to MCP server
  const cookieHeader = req.headers.get("Cookie") || "";
  const sessionToken =
    session.session?.token ?? extractSessionToken(cookieHeader);
  if (!sessionToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 3. Parse request body
  const { messages, model } = await req.json();

  // Select model based on client request
  const selectedModel =
    model === "gemini-2.5-flash"
      ? google("gemini-2.5-flash")
      : openai("gpt-4-turbo");

  // 4. Define AI SDK tools that call MCP tools
  const result = streamText({
    model: selectedModel,
    system:
      "You are Tracker, a proactive productivity assistant. When you call tools, always read their outputs and then provide a concise, human-friendly response that summarizes the findings, highlighting key numbers and trends. Never stop after a tool call—always follow up with a clear explanation or recommendation for the user.",
    messages: convertToModelMessages(messages),
    tools: {
      get_activity_summary: tool({
        description:
          "Get a comprehensive summary of productivity activities for a specified time period. Returns total activities, active days, duration statistics, process breakdown, and daily activity patterns.",
        inputSchema: z.object({
          days: z
            .number()
            .optional()
            .default(7)
            .describe("Number of days to look back (default: 7)"),
        }),
        execute: async ({ days }) => {
          const result = await callMCPTool(
            "get_activity_summary",
            { days },
            sessionToken,
            cookieHeader,
          );

          if (!result.success) {
            throw new Error(result.error || "Failed to get activity summary");
          }

          return result.data;
        },
      }),

      get_recent_activities: tool({
        description:
          "Get the most recent activity logs with details like process name, timestamps, duration, and system metrics. Useful for understanding recent work patterns.",
        inputSchema: z.object({
          limit: z
            .number()
            .optional()
            .default(10)
            .describe(
              "Maximum number of activities to return (default: 10, max: 100)",
            ),
        }),
        execute: async ({ limit }) => {
          const result = await callMCPTool(
            "get_recent_activities",
            { limit },
            sessionToken,
            cookieHeader,
          );

          if (!result.success) {
            throw new Error(result.error || "Failed to get recent activities");
          }

          return result.data;
        },
      }),
      get_daily_breakdown: tool({
        description:
          "Get a day-by-day breakdown of activities, including activity counts, durations, unique processes, and engagement metrics. Perfect for visualizing productivity trends over time.",
        inputSchema: z.object({
          days: z
            .number()
            .optional()
            .default(30)
            .describe("Number of days to include in breakdown (default: 30)"),
        }),
        execute: async ({ days }) => {
          const result = await callMCPTool(
            "get_daily_breakdown",
            { days },
            sessionToken,
            cookieHeader,
          );

          if (!result.success) {
            throw new Error(result.error || "Failed to get daily breakdown");
          }

          return result.data;
        },
      }),

      get_process_stats: tool({
        description:
          "Get detailed statistics about processes/applications used, including usage counts, duration stats (total, avg, min, max), and system resource usage (CPU, memory). Helps identify which applications consume most time and resources.",
        inputSchema: z.object({
          days: z
            .number()
            .optional()
            .default(7)
            .describe("Number of days to analyze (default: 7)"),
          limit: z
            .number()
            .optional()
            .default(20)
            .describe("Maximum number of processes to return (default: 20)"),
        }),
        execute: async ({ days, limit }) => {
          const result = await callMCPTool(
            "get_process_stats",
            { days, limit },
            sessionToken,
            cookieHeader,
          );

          if (!result.success) {
            throw new Error(result.error || "Failed to get process stats");
          }

          return result.data;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
