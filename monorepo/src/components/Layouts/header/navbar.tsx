"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_DATA } from "../sidebar/data";
import { ChevronDown } from "./navbar-icons";

export function Navbar() {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (url: string | undefined) => {
    if (!url) return false;
    return pathname === url;
  };

  return (
    <nav className="hidden flex-1 lg:flex">
      <ul className="flex items-center gap-6">
        {NAV_DATA.map((section) =>
          section.items.map((item) => (
            <li key={item.title} className="relative">
              {item.items.length > 0 ? (
                <div className="group relative">
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className={`flex items-center gap-1 px-1 py-2 font-medium text-dark-3 hover:text-primary dark:text-dark-6 dark:hover:text-white`}
                    aria-expanded={openDropdowns.includes(item.title)}
                  >
                    {item.title}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdowns.includes(item.title) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdowns.includes(item.title) && (
                    <div className="absolute left-0 z-10 mt-1 w-48 rounded-md bg-white py-1 shadow-lg dark:bg-gray-dark">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.url || "#"}
                          className={`block px-4 py-2 text-sm ${
                            isActive(subItem.url)
                              ? "bg-primary/10 text-primary dark:bg-primary/20"
                              : "text-dark-3 hover:bg-gray-100 dark:text-dark-6 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => toggleDropdown(item.title)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.url || "#"}
                  className={`block px-1 py-2 font-medium ${
                    isActive(item.url)
                      ? "text-primary"
                      : "text-dark-3 hover:text-primary dark:text-dark-6 dark:hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}
