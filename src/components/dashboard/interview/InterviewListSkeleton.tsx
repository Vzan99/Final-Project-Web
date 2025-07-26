export default function InterviewListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex justify-between items-center border-b pb-4"
        >
          <div className="w-1/4 h-4 bg-gray-300 rounded" />
          <div className="w-1/4 h-4 bg-gray-300 rounded" />
          <div className="w-1/6 h-4 bg-gray-300 rounded" />
          <div className="w-1/6 h-4 bg-gray-300 rounded" />
          <div className="w-1/6 h-4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
