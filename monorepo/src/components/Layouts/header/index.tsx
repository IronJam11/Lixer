"use client";

import Link from "next/link";
import Image from "next/image";
import lixerLogo from '@/assets/logos/Lixer.png';
import { Navbar } from "./navbar";
import { ThemeToggleSwitch } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white px-6 py-4 shadow-sm dark:bg-black md:px-8 lg:px-12">
      <Link href={"/"} className="flex items-center gap-2">
        <Image
          src={lixerLogo}
          width={48}
          height={48}
          alt="Lixer logo"
          className="h-8 w-auto"
        />
        <h1 className="text-xl font-medium tracking-tight text-black dark:text-white">Lixer</h1>
      </Link>
      
      <Navbar />
    </header>
  );
}
