import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWebMCPFormBase } from "../use-webmcp-form-base";
import type { ModelContext } from "../types";

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

const SCHEMA = {
  type: "object",
  properties: { name: { type: "string" } },
};

describe("useWebMCPFormBase", () => {
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

  it("modelContext が存在する場合、4つのツールを登録する", () => {
    const mc = createMockModelContext();
    (navigator as any).modelContext = mc;

    renderHook(() =>
      useWebMCPFormBase(createMockForm(), SCHEMA, {
        name: "test",
        description: "テスト",
      })
    );

    expect(mc.registerTool).toHaveBeenCalledTimes(4);
    const names = (mc.registerTool as any).mock.calls.map(
      (c: any) => c[0].name
    );
    expect(names).toEqual([
      "test_fill",
      "test_get_state",
      "test_validate",
      "test_reset",
    ]);
  });

  it("unmount 時にツールを解除する", () => {
    const mc = createMockModelContext();
    (navigator as any).modelContext = mc;

    const { unmount } = renderHook(() =>
      useWebMCPFormBase(createMockForm(), SCHEMA, {
        name: "test",
        description: "テスト",
      })
    );

    unmount();

    expect(mc.unregisterTool).toHaveBeenCalledTimes(4);
    const names = (mc.unregisterTool as any).mock.calls.map((c: any) => c[0]);
    expect(names).toEqual([
      "test_fill",
      "test_get_state",
      "test_validate",
      "test_reset",
    ]);
  });

  it("modelContext が存在しない場合、何も登録しない", () => {
    delete (navigator as any).modelContext;

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderHook(() =>
      useWebMCPFormBase(createMockForm(), SCHEMA, {
        name: "test",
        description: "テスト",
      })
    );

    warnSpy.mockRestore();
    // エラーが発生しないことを確認（暗黙的にテスト成功）
  });
});
