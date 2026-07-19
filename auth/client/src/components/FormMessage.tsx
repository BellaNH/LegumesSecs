type FormMessageProps = {
  type: "error" | "success";
  message: string;
};

export function FormMessage({ type, message }: FormMessageProps) {
  const className =
    type === "error"
      ? "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      : "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700";

  return <p className={className}>{message}</p>;
}
