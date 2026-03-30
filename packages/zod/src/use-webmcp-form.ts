import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ZodType } from "zod";
import { useWebMCPFormBase } from "@rhf-webmcp/core";
import type { WebMCPFormOptions } from "@rhf-webmcp/core";
import { zodToInputSchema } from "./zod-to-input-schema";

/**
 * React Hook Form + Zod のフォームを WebMCP ツールとして登録する。
 *
 * @example
 * ```tsx
 * const schema = z.object({ name: z.string().min(1) })
 * const form = useForm({ resolver: zodResolver(schema) })
 *
 * useWebMCPForm(form, schema, {
 *   name: "contact",
 *   description: "お問い合わせフォーム",
 * })
 * ```
 */
export function useWebMCPForm(
  form: UseFormReturn<any>,
  schema: ZodType,
  options: WebMCPFormOptions
): void {
  const inputSchema = useMemo(() => zodToInputSchema(schema), [schema]);
  useWebMCPFormBase(form, inputSchema, options);
}
