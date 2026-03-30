import { describe, it, expect } from "vitest";
import { z } from "zod";
import { zodToInputSchema } from "../zod-to-input-schema";

describe("zodToInputSchema", () => {
  it("基本的な Zod オブジェクトを JSON Schema に変換する", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const result = zodToInputSchema(schema);

    expect(result.type).toBe("object");
    expect(result.properties).toBeDefined();
    expect((result.properties as any).name).toMatchObject({ type: "string" });
    expect((result.properties as any).age).toMatchObject({ type: "number" });
    expect(result.required).toEqual(["name", "age"]);
  });

  it("オプショナルフィールドを正しく扱う", () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional(),
    });

    const result = zodToInputSchema(schema);
    expect(result.required).toEqual(["name"]);
  });

  it("$schema キーを含まない", () => {
    const schema = z.object({ x: z.string() });
    const result = zodToInputSchema(schema);
    expect(result).not.toHaveProperty("$schema");
  });

  it("enum 型を変換する", () => {
    const schema = z.object({
      role: z.enum(["admin", "user"]),
    });

    const result = zodToInputSchema(schema);
    expect((result.properties as any).role.enum).toEqual(["admin", "user"]);
  });
});
