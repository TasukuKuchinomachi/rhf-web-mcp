import type { UseFormReturn } from "react-hook-form";
import type { WebMCPFormOptions, WebMCPToolDefinition } from "./types";
import { formatErrors } from "./format-errors";

function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
  };
}

const EMPTY_SCHEMA = {
  type: "object" as const,
  properties: {},
  additionalProperties: false,
};

/**
 * 4つの MCP ツール定義を生成する。
 */
export function createTools(
  form: UseFormReturn<any>,
  inputSchema: Record<string, unknown>,
  options: WebMCPFormOptions
): WebMCPToolDefinition[] {
  const { name, description } = options;

  // fill 用のスキーマ: required を外してすべてオプショナルにする
  const fillSchema = { ...inputSchema };
  delete fillSchema.required;

  return [
    {
      name: `${name}_fill`,
      description: `${description} — フィールドに値を入力し、バリデーションを実行して結果を返す`,
      inputSchema: fillSchema,
      handler: async (params) => {
        for (const [key, value] of Object.entries(params)) {
          form.setValue(key, value, { shouldDirty: true });
        }
        const isValid = await form.trigger();
        return textResult({
          success: isValid,
          values: form.getValues(),
          ...(isValid ? {} : { errors: formatErrors(form.formState.errors) }),
        });
      },
    },
    {
      name: `${name}_get_state`,
      description: `${description} — 現在の値・エラー・dirty状態を取得する（readOnly）`,
      inputSchema: EMPTY_SCHEMA,
      handler: async () => {
        return textResult({
          values: form.getValues(),
          errors: formatErrors(form.formState.errors),
          isDirty: form.formState.isDirty,
          isValid: form.formState.isValid,
          dirtyFields: form.formState.dirtyFields,
        });
      },
    },
    {
      name: `${name}_validate`,
      description: `${description} — バリデーションを実行して結果を返す（readOnly）`,
      inputSchema: EMPTY_SCHEMA,
      handler: async () => {
        const isValid = await form.trigger();
        return textResult({
          isValid,
          ...(isValid ? {} : { errors: formatErrors(form.formState.errors) }),
        });
      },
    },
    {
      name: `${name}_reset`,
      description: `${description} — フォームをデフォルト値にリセットする`,
      inputSchema: EMPTY_SCHEMA,
      handler: async () => {
        form.reset();
        return textResult({ success: true });
      },
    },
  ];
}
