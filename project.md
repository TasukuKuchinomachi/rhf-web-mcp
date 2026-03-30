# rhf-webmcp

React Hook Form を **1行追加するだけ** で WebMCP 対応フォームにするライブラリ。

---

## 目的とゴール

**AIエージェントがWebフォームを確実に操作できる世界を作る。**

現在のAIエージェントはフォームをDOMの「見た目」に頼って操作している。
これは脆く、レイアウト変更や動的描画に容易く壊れる。

WebMCP はブラウザ標準として「フォームが自らツールを公開する」仕組みを定義した。
rhf-webmcp はそれを **既存の React Hook Form コードに一切手を加えずに実現する**。

```
既存フォームへの変更: 0行
追加するコード    : 1行
```

### ゴール

- React Hook Form で書かれたあらゆるフォームが、1行追加で WebMCP ツールとして公開できる
- Zod スキーマがバリデーション定義と MCP の `inputSchema` を**同時に**担う（単一ソース）
- WebMCP 非対応環境では何も起きない（フォームの既存動作に影響ゼロ）
- OSSとして公開し、エコシステムの標準ライブラリになる

---

## 背景

### WebMCP とは

W3C Web Machine Learning Community Group が策定中のブラウザ標準 API（Draft）。
`navigator.modelContext.registerTool()` によって、Webページ自体が MCP サーバーとして振る舞う。

- **トランスポート層なし** — ブラウザが仲介。ネットワーク不要
- **認証不要** — ブラウザセッション（Cookie/SSO）をそのまま継承
- **Chrome 146+** で実験的にサポート（フラグ有効化が必要）

通常の MCP（stdio / SSE）とは根本的に異なる。サーバーではなく**ページ自身がツールを持つ**。

### なぜ React Hook Form か

- React エコシステムで最も広く使われているフォームライブラリ
- `setValue` / `getValues` / `trigger` / `reset` など、プログラマティック操作の API が充実している
- `zodResolver` との組み合わせにより、Zod スキーマが**バリデーション定義**と**MCP inputSchema の自動生成源**を兼ねられる

---

## パッケージ構成

```
@rhf-webmcp/core   resolver 非依存のベース実装
@rhf-webmcp/zod    Zod 専用。inputSchema を自動生成
```

将来的に `@rhf-webmcp/yup` 等を追加可能な設計。

---

## API

```tsx
import { useWebMCPForm } from "@rhf-webmcp/zod"

const schema = z.object({
  name: z.string().min(1, "名前は必須"),
  email: z.string().email("有効なメールアドレスを入力"),
})

function ContactForm() {
  const form = useForm({ resolver: zodResolver(schema) })

  // この1行だけ追加する。既存コードは一切変更なし。
  useWebMCPForm(form, schema, {
    name: "contact",
    description: "お問い合わせフォーム",
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("name")} />
      <input {...form.register("email")} />
      <button type="submit">送信</button>
    </form>
  )
}
```

フックを呼ぶと、以下の MCP ツールが自動登録される。

| ツール名 | 説明 |
|---|---|
| `contact_fill` | フィールドに値を入力し、バリデーションを実行して結果を返す |
| `contact_get_state` | 現在の値・エラー・dirty状態を取得する（readOnly） |
| `contact_validate` | バリデーションを実行して結果を返す（readOnly） |
| `contact_reset` | フォームをデフォルト値にリセットする |

コンポーネントが unmount されると、全ツールが自動的に解除される。

---

## 設計方針

**侵襲性ゼロ** — 既存コードへの変更を強制しない。wrap するだけ。

**単一ソース** — Zod スキーマが唯一の真実。バリデーションロジックと MCP スキーマの二重管理をしない。

**Graceful degradation** — `navigator.modelContext` が存在しない環境（Safari、Chrome 145以下）では何もしない。dev 環境のみ `console.warn` を出す。

**薄いラッパー** — WebMCP 仕様の進化に追従できるよう、API への依存を最小限にとどめる。

---

## 対応環境

| 環境 | 状況 |
|---|---|
| Chrome 146+（WebMCP フラグ有効） | ✅ フル動作 |
| Chrome 146+（フラグ無効）/ その他ブラウザ | ✅ フォームは通常通り動作。MCPツールは登録されない |
| SSR（Next.js 等） | ✅ サーバー側では `navigator` が存在しないため何もしない |

---

## ロードマップ

- [ ] `@rhf-webmcp/core` — コア実装
- [ ] `@rhf-webmcp/zod` — Zod 統合（Zod v3 / v4 対応）
- [ ] submit ツール — `requestUserInteraction` を使った送信確認フロー
- [ ] テスト — `navigator.modelContext` モック設計
- [ ] example page を ghpages で提供
