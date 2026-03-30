import { describe, it, expect } from "vitest";
import { formatErrors } from "../format-errors";

describe("formatErrors", () => {
  it("フラットなエラーを変換する", () => {
    const errors = {
      name: { type: "required", message: "名前は必須です" },
      email: { type: "pattern", message: "メール形式が不正です" },
    };

    expect(formatErrors(errors as any)).toEqual({
      name: "名前は必須です",
      email: "メール形式が不正です",
    });
  });

  it("ネストしたエラーをドット区切りで変換する", () => {
    const errors = {
      address: {
        city: { type: "required", message: "市区町村は必須です" },
      },
    };

    expect(formatErrors(errors as any)).toEqual({
      "address.city": "市区町村は必須です",
    });
  });

  it("空のエラーオブジェクトを扱える", () => {
    expect(formatErrors({})).toEqual({});
  });

  it("null/undefined のエントリをスキップする", () => {
    const errors = {
      name: null,
      email: undefined,
    };

    expect(formatErrors(errors as any)).toEqual({});
  });
});
