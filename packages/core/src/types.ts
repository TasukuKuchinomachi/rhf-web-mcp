export interface WebMCPFormOptions {
  /** MCP ツール名のプレフィックス（例: "contact" → "contact_fill" 等） */
  name: string;
  /** フォームの説明文 */
  description: string;
}

export interface WebMCPToolResult {
  content: Array<{ type: "text"; text: string }>;
}

export interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<WebMCPToolResult>;
}

export interface ModelContext {
  registerTool(tool: WebMCPToolDefinition): void;
  unregisterTool(name: string): void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}
