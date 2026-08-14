const CardSkeleton = () => (
  <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-ink/8 bg-bone">
    <div className="skeleton aspect-[4/5]" />
    <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
      <div className="skeleton h-2.5 w-24" />
      <div className="skeleton h-4 w-4/5" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-8 w-full rounded-full" />
    </div>
  </div>
);

const HomePageSkeleton = () => {
  return (
    <div className="bg-cream" aria-busy="true" aria-label="Loading page">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="grid items-center gap-14 py-14 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24 lg:px-6 xl:mx-auto xl:max-w-[1280px]">
          <div className="space-y-6 px-4">
            <div className="skeleton h-3 w-56" />
            <div className="skeleton h-16 w-11/12" />
            <div className="skeleton h-16 w-4/5" />
            <div className="skeleton h-5 w-2/3" />
            <div className="flex gap-3 pt-2">
              <div className="skeleton h-13 w-48 rounded-full" />
              <div className="skeleton h-13 w-40 rounded-full" />
            </div>
            <div className="skeleton h-4 w-72" />
          </div>
          <div className="hidden px-4 lg:block">
            <div className="skeleton aspect-[4/5] w-full rounded-[1.75rem]" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-y border-ink/8 bg-cream-deep py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] space-y-8 px-4">
          <div className="space-y-3">
            <div className="skeleton h-3 w-40" />
            <div className="skeleton h-10 w-96 max-w-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.18fr_0.82fr_0.82fr] lg:grid-rows-2">
            <div className="skeleton min-h-[300px] rounded-lg lg:row-span-2 lg:min-h-[570px]" />
            <div className="skeleton min-h-[220px] rounded-lg lg:col-span-2" />
            <div className="skeleton min-h-[220px] rounded-lg" />
            <div className="skeleton min-h-[220px] rounded-lg" />
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1280px] space-y-8 px-4">
          <div className="space-y-3">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-10 w-[420px] max-w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;
