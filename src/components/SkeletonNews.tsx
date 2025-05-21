
import React from "react";

interface SkeletonNewsProps {
  count?: number;
}

export const SkeletonNews: React.FC<SkeletonNewsProps> = ({ count = 5 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="h-3 bg-gray-800 rounded w-5/6 animate-pulse"></div>
          </div>
        ))}
    </>
  );
};

export default SkeletonNews;
