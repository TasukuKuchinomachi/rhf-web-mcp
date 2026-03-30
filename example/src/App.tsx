import { ContactForm } from "./ContactForm";
import { WebMCPStatus } from "./WebMCPStatus";

export function App() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>
          rhf-webmcp Example
        </h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          React Hook Form を1行追加で WebMCP 対応にするデモ
        </p>
        <WebMCPStatus />
      </header>
      <main>
        <ContactForm />
      </main>
      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "1rem",
          borderTop: "1px solid #e0e0e0",
          color: "#999",
          fontSize: "0.85rem",
        }}
      >
        <h3 style={{ fontSize: "0.95rem", color: "#666", marginBottom: "0.5rem" }}>
          登録される MCP ツール
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
              <th style={{ padding: "0.4rem 0.5rem" }}>ツール名</th>
              <th style={{ padding: "0.4rem 0.5rem" }}>説明</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                <code>contact_fill</code>
              </td>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                フィールドに値を入力し、バリデーションを実行して結果を返す
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                <code>contact_get_state</code>
              </td>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                現在の値・エラー・dirty状態を取得する
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                <code>contact_validate</code>
              </td>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                バリデーションを実行して結果を返す
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                <code>contact_reset</code>
              </td>
              <td style={{ padding: "0.4rem 0.5rem" }}>
                フォームをデフォルト値にリセットする
              </td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
}
