import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { WebMCPFormOptions } from "./types";
import { createTools } from "./create-tools";

/**
 * RHF フォームを WebMCP ツールとして登録するベースフック。
 * inputSchema は JSON Schema 形式で渡す（resolver 非依存）。
 */
export function useWebMCPFormBase(
  form: UseFormReturn<any>,
  inputSchema: Record<string, unknown>,
  options: WebMCPFormOptions
): void {
  const { name, description } = options;

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.modelContext) {
      try {
        // dev 環境でのみ警告を出す（ブラウザ・Node 両対応）
        const isDev =
          typeof globalThis !== "undefined" &&
          (globalThis as any).process?.env?.NODE_ENV === "development";
        if (isDev) {
          console.warn(
            "[rhf-webmcp] navigator.modelContext is not available. MCP tools will not be registered."
          );
        }
      } catch {
        // process 未定義の環境では無視
      }
      return;
    }

    const mc = navigator.modelContext;
    const tools = createTools(form, inputSchema, { name, description });

    for (const tool of tools) {
      mc.registerTool(tool);
    }

    return () => {
      for (const tool of tools) {
        mc.unregisterTool(tool.name);
      }
    };
  }, [name, description]); // eslint-disable-line react-hooks/exhaustive-deps
}
