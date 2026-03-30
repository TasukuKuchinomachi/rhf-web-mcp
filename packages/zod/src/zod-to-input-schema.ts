import { zodToJsonSchema } from "zod-to-json-schema";
import type { ZodType } from "zod";

/**
 * Zod スキーマを MCP の inputSchema（JSON Schema）に変換する。
 * $schema や $ref などの不要なキーを除去してクリーンな形を返す。
 */
export function zodToInputSchema(schema: ZodType): Record<string, unknown> {
  const jsonSchema = zodToJsonSchema(schema, {
    target: "openApi3",
    $refStrategy: "none",
  });

  // zodToJsonSchema が付与するメタキーを削除
  const { $schema, ...rest } = jsonSchema as Record<string, unknown>;
  return rest;
}
