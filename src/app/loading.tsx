export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
      <p className="title-serif text-lg text-muted">Cargando…</p>
    </div>
  );
}
