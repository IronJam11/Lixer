"use client";

import { SearchIcon } from "@/assets/icons";
import Link from "next/link";
import { Navbar } from "./navbar";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <div className="flex items-center">
        <Link href={"/"} className="mr-8">
          <h1 className="text-2xl font-bold text-dark dark:text-white">Lixer</h1>
        </Link>
        
        <Navbar />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="relative w-full max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
          />

          <button className="absolute left-0 top-1/2 -translate-y-1/2 py-3 pl-5">
            <SearchIcon className="size-6 text-gray-5 dark:text-dark-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 min-[375px]:gap-4">
          <ThemeToggleSwitch />
          <Notification />
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
