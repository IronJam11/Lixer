"use client";

import Link from "next/link";
import Image from "next/image";
import lixerLogo from '@/assets/logos/Lixer.png';
import { Navbar } from "./navbar";


export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between bg-black py-4 shadow-sm">
      <Link href={"/"} className="flex items-center gap-2">
        <Image
          src={lixerLogo}
          width={64}
          height={64}
          alt="Lixer logo"
          className="h-10 w-auto"
        />
        <h1 className="text-2xl font-medium tracking-tight text-white">Lixer</h1>
      </Link>
      
      <Navbar />
    </header>
  );
}
