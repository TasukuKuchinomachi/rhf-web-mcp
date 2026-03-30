import type { FieldErrors } from "react-hook-form";

/**
 * RHF の FieldErrors をフラットな { fieldName: message } 形式に変換する。
 */
export function formatErrors(
  errors: FieldErrors,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (value.message && typeof value.message === "string") {
      result[path] = value.message;
    } else if (typeof value === "object" && !value.type) {
      Object.assign(result, formatErrors(value as FieldErrors, path));
    }
  }

  return result;
}
