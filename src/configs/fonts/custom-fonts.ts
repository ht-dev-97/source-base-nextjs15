import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

const GeistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const GeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Abolition = localFont({
  src: [
    {
      path: "../../assets/fonts/abolition/FontsFree-Net-Abolition-W00-Regular.ttf",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-abolition",
});

const SNPro = localFont({
  src: [
    {
      path: "../../assets/fonts/sn-pro/SNPro-Regular.otf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../assets/fonts/sn-pro/SNPro-Medium.otf",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../assets/fonts/sn-pro/SNPro-Semibold.otf",
      style: "normal",
      weight: "600",
    },
    {
      path: "../../assets/fonts/sn-pro/SNPro-Bold.otf",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-sn-pro",
});

export { GeistSans, GeistMono, Abolition, SNPro };
