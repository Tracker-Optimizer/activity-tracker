/**
 * MCP Client for calling the MCP server tools
 */

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:8787";

export interface MCPToolParams {
  days?: number;
  limit?: number;
}

export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Call an MCP tool
 * Forwards the user's session cookie for authentication
 */
export async function callMCPTool<T = unknown>(
  toolName: string,
  params: MCPToolParams,
  sessionToken: string,
  cookieHeader?: string,
): Promise<MCPResponse<T>> {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools/${toolName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Session-Token": sessionToken,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || `HTTP ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("MCP tool call error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * List available MCP tools
 */
export async function listMCPTools() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to list MCP tools:", error);
    return { success: false, tools: [] };
  }
}
