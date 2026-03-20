export default function RouteLoading() {
  return (
    <main className="mx-auto w-full max-w-[80rem] space-y-6 px-4 py-6 md:px-8 lg:py-10">
      <section className="space-y-4">
        <div className="h-8 w-64 animate-pulse bg-muted" />
        <div className="h-4 w-80 animate-pulse bg-muted" />
        <div className="h-10 w-72 animate-pulse bg-muted" />
      </section>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-56 animate-pulse bg-muted" />
            <div className="h-6 w-48 animate-pulse bg-muted" />
            <div className="h-4 w-full animate-pulse bg-muted" />
            <div className="h-4 w-32 animate-pulse bg-muted" />
          </div>
        ))}
      </section>
    </main>
  );
}
