import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { z } from "zod";
import { useWebMCPForm } from "../use-webmcp-form";
import type { ModelContext } from "@rhf-webmcp/core";

function createMockForm() {
  return {
    setValue: vi.fn(),
    getValues: vi.fn(() => ({})),
    trigger: vi.fn(async () => true),
    reset: vi.fn(),
    formState: {
      errors: {},
      isDirty: false,
      isValid: true,
      dirtyFields: {},
    },
  } as any;
}

function createMockModelContext(): ModelContext {
  return {
    registerTool: vi.fn(),
    unregisterTool: vi.fn(),
  };
}

describe("useWebMCPForm", () => {
  let originalModelContext: any;

  beforeEach(() => {
    originalModelContext = navigator.modelContext;
  });

  afterEach(() => {
    if (originalModelContext === undefined) {
      delete (navigator as any).modelContext;
    } else {
      (navigator as any).modelContext = originalModelContext;
    }
  });

  it("Zod スキーマから自動的にツールを登録する", () => {
    const mc = createMockModelContext();
    (navigator as any).modelContext = mc;

    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });

    renderHook(() =>
      useWebMCPForm(createMockForm(), schema, {
        name: "contact",
        description: "お問い合わせフォーム",
      })
    );

    expect(mc.registerTool).toHaveBeenCalledTimes(4);

    // fill ツールの inputSchema に properties が含まれていることを確認
    const fillTool = (mc.registerTool as any).mock.calls[0][0];
    expect(fillTool.name).toBe("contact_fill");
    expect(fillTool.inputSchema.properties).toHaveProperty("name");
    expect(fillTool.inputSchema.properties).toHaveProperty("email");
    // fill は required を持たない（全フィールドオプショナル）
    expect(fillTool.inputSchema).not.toHaveProperty("required");
  });

  it("unmount 時にツールを解除する", () => {
    const mc = createMockModelContext();
    (navigator as any).modelContext = mc;

    const schema = z.object({ name: z.string() });

    const { unmount } = renderHook(() =>
      useWebMCPForm(createMockForm(), schema, {
        name: "test",
        description: "テスト",
      })
    );

    unmount();

    expect(mc.unregisterTool).toHaveBeenCalledTimes(4);
  });
});
