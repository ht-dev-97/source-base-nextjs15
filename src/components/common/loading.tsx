"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="w-[525px] h-[262px]">
        <DotLottieReact
          src="https://lottie.host/0b6ea653-e342-44e7-863c-681306cb4b93/CshlJibGmN.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
