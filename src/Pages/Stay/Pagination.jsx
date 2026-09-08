export default function Pagination({ current, onChange, total }) {
  if (total <= 1) return null;
  return <nav aria-label="Results pages" data-testid="page-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, margin: "20px 0" }}>
    <button type="button" disabled={current === 1} onClick={() => onChange(current - 1)}>Previous</button>
    {Array.from({ length: total }, (_, index) => index + 1).map((page) => <button type="button" key={page}
      aria-current={current === page ? "page" : undefined} aria-label={`Page ${page}`}
      style={{ padding: "8px 12px", color: "white", backgroundColor: current === page ? "#16574f" : "teal", borderRadius: 5 }}
      onClick={() => onChange(page)}>{page}</button>)}
    <button type="button" disabled={current === total} onClick={() => onChange(current + 1)}>Next</button>
  </nav>;
}
