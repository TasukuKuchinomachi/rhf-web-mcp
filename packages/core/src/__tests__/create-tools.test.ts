import { describe, it, expect, vi } from "vitest";
import { createTools } from "../create-tools";

function createMockForm(overrides: Record<string, any> = {}) {
  const values: Record<string, any> = {};
  return {
    setValue: vi.fn((key: string, value: any) => {
      values[key] = value;
    }),
    getValues: vi.fn(() => ({ ...values })),
    trigger: vi.fn(async () => true),
    reset: vi.fn(),
    formState: {
      errors: {},
      isDirty: false,
      isValid: true,
      dirtyFields: {},
    },
    ...overrides,
  } as any;
}

const SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name", "email"],
};

const OPTIONS = { name: "contact", description: "お問い合わせフォーム" };

describe("createTools", () => {
  it("4つのツールを生成する", () => {
    const tools = createTools(createMockForm(), SCHEMA, OPTIONS);
    expect(tools).toHaveLength(4);
    expect(tools.map((t) => t.name)).toEqual([
      "contact_fill",
      "contact_get_state",
      "contact_validate",
      "contact_reset",
    ]);
  });

  it("fill ツールの inputSchema から required を除去する", () => {
    const tools = createTools(createMockForm(), SCHEMA, OPTIONS);
    const fill = tools[0];
    expect(fill.inputSchema).not.toHaveProperty("required");
    expect(fill.inputSchema).toHaveProperty("properties");
  });

  it("fill ツールが値を設定してバリデーションを実行する", async () => {
    const form = createMockForm();
    const tools = createTools(form, SCHEMA, OPTIONS);
    const fill = tools[0];

    const result = await fill.handler({ name: "太郎", email: "test@example.com" });

    expect(form.setValue).toHaveBeenCalledWith("name", "太郎", {
      shouldDirty: true,
    });
    expect(form.setValue).toHaveBeenCalledWith("email", "test@example.com", {
      shouldDirty: true,
    });
    expect(form.trigger).toHaveBeenCalled();

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });

  it("fill ツールがバリデーションエラーを返す", async () => {
    const form = createMockForm({
      trigger: vi.fn(async () => false),
      formState: {
        errors: { name: { type: "required", message: "名前は必須" } },
        isDirty: true,
        isValid: false,
        dirtyFields: {},
      },
    });
    const tools = createTools(form, SCHEMA, OPTIONS);
    const result = await tools[0].handler({});

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(false);
    expect(parsed.errors).toEqual({ name: "名前は必須" });
  });

  it("get_state ツールが現在の状態を返す", async () => {
    const form = createMockForm({
      getValues: vi.fn(() => ({ name: "太郎" })),
      formState: {
        errors: {},
        isDirty: true,
        isValid: true,
        dirtyFields: { name: true },
      },
    });
    const tools = createTools(form, SCHEMA, OPTIONS);
    const result = await tools[1].handler({});

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.values).toEqual({ name: "太郎" });
    expect(parsed.isDirty).toBe(true);
    expect(parsed.dirtyFields).toEqual({ name: true });
  });

  it("validate ツールがバリデーション結果を返す", async () => {
    const form = createMockForm();
    const tools = createTools(form, SCHEMA, OPTIONS);
    const result = await tools[2].handler({});

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.isValid).toBe(true);
    expect(form.trigger).toHaveBeenCalled();
  });

  it("reset ツールがフォームをリセットする", async () => {
    const form = createMockForm();
    const tools = createTools(form, SCHEMA, OPTIONS);
    const result = await tools[3].handler({});

    expect(form.reset).toHaveBeenCalled();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.success).toBe(true);
  });
});
