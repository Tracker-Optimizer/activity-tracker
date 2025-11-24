/**
 * MCP Client for calling the MCP server tools
 */

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:8787";
const MCP_SERVICE_TOKEN = process.env.MCP_SERVICE_TOKEN;

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
  userId: string,
): Promise<MCPResponse<T>> {
  if (!MCP_SERVICE_TOKEN) {
    throw new Error("MCP_SERVICE_TOKEN is not configured");
  }

  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp/tools/${toolName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MCP_SERVICE_TOKEN}`,
        "X-User-Id": userId,
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
