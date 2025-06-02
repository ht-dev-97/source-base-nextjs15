'use client'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import React from 'react'

const LoadingOverlay = () => {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
      <div className="h-[262px] w-[525px]">
        <DotLottieReact
          src="https://lottie.host/0b6ea653-e342-44e7-863c-681306cb4b93/CshlJibGmN.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  )
}

export default LoadingOverlay
