export function toCsv<T extends Record<string, unknown>>(rows: T[]) {
  const headers = Array.from(
    rows.reduce<Set<string>>((s, r) => {
      Object.keys(r).forEach((k) => s.add(k));
      return s;
    }, new Set()),
  );

  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    const needsQuotes = /[",\n]/.test(s);
    const out = s.replaceAll('"', '""');
    return needsQuotes ? `"${out}"` : out;
  };

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => {
      const row = r as Record<string, unknown>;
      return headers.map((h) => escape(row[h])).join(",");
    }),
  ];

  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
