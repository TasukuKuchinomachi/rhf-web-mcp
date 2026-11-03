import { toJSONSchema } from "zod";
import type { ZodType } from "zod";

/**
 * Zod スキーマを MCP の inputSchema（JSON Schema）に変換する。
 * $schema などの不要なキーを除去してクリーンな形を返す。
 */
export function zodToInputSchema(schema: ZodType): Record<string, unknown> {
  const jsonSchema = toJSONSchema(schema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  });

  const { $schema, ...rest } = jsonSchema as Record<string, unknown>;
  return rest;
}
