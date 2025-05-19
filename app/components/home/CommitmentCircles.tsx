"use client";

export function CommitmentCircles() {
  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
      <div className="flex flex-col items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-indigo-200 bg-white p-4 shadow-md">
          <span className="text-2xl font-bold text-indigo-600">100%</span>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-700">
          Data Protection
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-indigo-200 bg-white p-4 shadow-md">
          <span className="text-2xl font-bold text-indigo-600">100%</span>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-700">Free</span>
      </div>
    </div>
  );
}
