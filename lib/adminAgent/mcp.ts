import "server-only";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ADMIN_AGENT_TOOLS, invokeAdminAgentTool } from "./tools";
import type { AgentTokenContext } from "./types";

export function createAdminAgentMcpServer(context: AgentTokenContext) {
  const server = new McpServer({
    name: "build-admin-agent",
    title: "Administration BUILD",
    version: "1.0.0",
  }, {
    instructions: "Tu prépares l'administration de BUILD avec les droits de ce jeton. Les mails et les nouveautés exigent toujours une approbation humaine.",
  });

  for (const [name, tool] of Object.entries(ADMIN_AGENT_TOOLS)) {
    server.registerTool(name, {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.schema.shape,
    }, async (input) => invokeAdminAgentTool(name, input, context));
  }
  return server;
}
