export default function UserProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#f3f2ef] pb-16 pt-8 text-black max-w-5xl mx-auto px-4 md:px-0">
      <div
        className="animate-pulse bg-gray-300 rounded-t-xl h-48 mb-10"
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-b-xl shadow p-6 mb-10 px-4 md:px-8 flex flex-col items-start">
        <div className="absolute -top-16 left-8">
          <div className="animate-pulse bg-gray-300 w-32 h-32 rounded-full border-6 border-white" />
        </div>
        <div className="animate-pulse bg-gray-300 h-10 w-40 ml-auto mb-4 rounded-full" />
        <div className="animate-pulse bg-gray-300 h-8 w-60 mb-2 rounded" />
        <div className="animate-pulse bg-gray-300 h-4 w-40 rounded" />
        <div className="mt-4">
          <div className="animate-pulse bg-gray-300 h-6 w-32 mb-1 rounded" />
          <div className="animate-pulse bg-gray-300 h-12 w-full rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-300 h-32 rounded-xl"
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="md:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-300 h-24 rounded-xl"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
