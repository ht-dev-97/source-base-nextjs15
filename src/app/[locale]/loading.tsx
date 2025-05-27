import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  );
}
