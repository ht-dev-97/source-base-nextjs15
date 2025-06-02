import React from 'react'

export default function Loading() {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    </div>
  )
}
