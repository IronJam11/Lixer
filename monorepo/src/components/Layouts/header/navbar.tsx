"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Define main nav items to match the Hyperliquid style
const NAV_ITEMS = [
  { title: "Stats", url: "/stats" },
  { title: "Docs", url: "/docs" },
  { title: "Ecosystem", url: "/ecosystem" }
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url;
  };

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-10">
        {NAV_ITEMS.map((item) => (
          <li key={item.title}>
            <Link
              href={item.url}
              className={`text-base font-normal transition-colors ${
                isActive(item.url)
                  ? "text-black dark:text-white"
                  : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link 
        href="/app" 
        className="ml-10 rounded-full bg-[#c6f6de] px-8 py-2 text-base font-medium text-black hover:bg-[#b0edce] transition-colors"
      >
        Launch App
      </Link>
    </nav>
  );
}
