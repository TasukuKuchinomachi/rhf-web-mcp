import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWebMCPForm } from "@rhf-webmcp/zod";

const schema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  category: z.enum(["general", "support", "feedback"], {
    errorMap: () => ({ message: "カテゴリを選択してください" }),
  }),
  message: z.string().min(10, "メッセージは10文字以上で入力してください"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      category: undefined,
      message: "",
    },
  });

  // この1行だけ追加。既存コードは一切変更なし。
  useWebMCPForm(form, schema, {
    name: "contact",
    description: "お問い合わせフォーム",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: FormData) => {
    alert(`送信完了:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <fieldset style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: "1.5rem" }}>
        <legend style={{ fontWeight: 600, fontSize: "1.1rem", padding: "0 0.5rem" }}>
          お問い合わせフォーム
        </legend>

        <Field label="お名前" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="山田太郎"
            style={inputStyle}
          />
        </Field>

        <Field label="メールアドレス" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="taro@example.com"
            style={inputStyle}
          />
        </Field>

        <Field label="カテゴリ" error={errors.category?.message}>
          <select {...register("category")} style={inputStyle}>
            <option value="">選択してください</option>
            <option value="general">一般的なお問い合わせ</option>
            <option value="support">サポート</option>
            <option value="feedback">フィードバック</option>
          </select>
        </Field>

        <Field label="メッセージ" error={errors.message?.message}>
          <textarea
            {...register("message")}
            rows={4}
            placeholder="お問い合わせ内容を入力してください"
            style={inputStyle}
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1.5rem",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          送信
        </button>
      </fieldset>

      <details style={{ fontSize: "0.85rem", color: "#666" }}>
        <summary style={{ cursor: "pointer" }}>
          使い方: コードの追加は1行だけ
        </summary>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: 6,
            overflow: "auto",
            marginTop: "0.5rem",
            lineHeight: 1.5,
          }}
        >
{`import { useWebMCPForm } from "@rhf-webmcp/zod"

// 既存の useForm は一切変更なし
const form = useForm({ resolver: zodResolver(schema) })

// この1行を追加するだけ
useWebMCPForm(form, schema, {
  name: "contact",
  description: "お問い合わせフォーム",
})`}
        </pre>
      </details>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.8rem" }}>
      <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>{label}</label>
      {children}
      {error && (
        <span style={{ color: "#d32f2f", fontSize: "0.8rem" }}>{error}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.7rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: "0.95rem",
  outline: "none",
};
