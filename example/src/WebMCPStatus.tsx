const hasWebMCP =
  typeof navigator !== "undefined" && !!navigator.modelContext;

export function WebMCPStatus() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        marginTop: "0.5rem",
        padding: "0.3rem 0.8rem",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: 500,
        background: hasWebMCP ? "#e6f9e6" : "#fff3e0",
        color: hasWebMCP ? "#2e7d32" : "#e65100",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: hasWebMCP ? "#4caf50" : "#ff9800",
        }}
      />
      {hasWebMCP ? (
        "WebMCP 対応 — MCP ツールが登録されています"
      ) : (
        <span>
          WebMCP 未対応 —{" "}
          <a
            href="chrome://flags/#enable-webmcp-testing"
            style={{ color: "inherit", textDecoration: "underline" }}
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText("chrome://flags/#enable-webmcp-testing");
              alert("chrome://flags/#enable-webmcp-testing をコピーしました。アドレスバーに貼り付けてください。");
            }}
          >
            chrome://flags/#enable-webmcp-testing
          </a>
          {" "}を有効にしてください
        </span>
      )}
    </div>
  );
}
