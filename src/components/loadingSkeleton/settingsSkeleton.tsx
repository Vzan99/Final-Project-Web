export default function SettingsSkeleton() {
  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-48 mb-6" />
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar skeleton */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="h-8 bg-gray-300 rounded" />
          <div className="h-8 bg-gray-300 rounded" />
          <div className="h-8 bg-gray-300 rounded" />
        </div>
        {/* Content skeleton */}
        <div className="flex-grow rounded max-w-2xl min-h-[550px] space-y-4">
          <div className="h-8 bg-gray-300 rounded w-64" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
          <div className="h-6 bg-gray-300 rounded" />
        </div>
      </div>
    </main>
  );
}
