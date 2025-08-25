"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type NotificationData = {
  type?: string;
  source?: string;
  count?: number;
  newSwap?: {
    blockNumber?: number;
    block_number?: number;
    transactionHash?: string;
    transaction_hash?: string;
  };
  data?: Array<{
    blockNumber?: number;
    block_number?: number;
    amount0?: string;
    amount1?: string;
    poolAddress?: string;
  }>;
  subTitle?: string;
  timestamp?: number;
};
import { BellIcon } from "./icons";

// Real-time notification list
export function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDotVisible, setIsDotVisible] = useState(true);
  const [notificationList, setNotificationList] = useState<NotificationData[]>([]);
  const isMobile = useIsMobile();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://lixer.onrender.com/ws";
    ws.current = new WebSocket(wsUrl);
    ws.current.onmessage = (event: MessageEvent) => {
      const data: NotificationData = JSON.parse(event.data);
      setNotificationList((prev: NotificationData[]) => [data, ...prev]);
      setIsDotVisible(true);
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <Dropdown
      isOpen={isOpen}
      setIsOpen={(open) => {
        setIsOpen(open);

        if (setIsDotVisible) setIsDotVisible(false);
      }}
    >
      <DropdownTrigger
        className="grid size-12 place-items-center rounded-full border bg-gray-2 text-dark outline-none hover:text-primary focus-visible:border-primary focus-visible:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus-visible:border-primary"
        aria-label="View Notifications"
      >
        <span className="relative">
          <BellIcon />

          {isDotVisible && (
            <span
              className={cn(
                "absolute right-0 top-0 z-1 size-2 rounded-full bg-red-light ring-2 ring-gray-2 dark:ring-dark-3",
              )}
            >
              <span className="absolute inset-0 -z-1 animate-ping rounded-full bg-red-light opacity-75" />
            </span>
          )}
        </span>
      </DropdownTrigger>

      <DropdownContent
        align={isMobile ? "end" : "center"}
        className="border border-stroke bg-white px-3.5 py-3 shadow-md dark:border-dark-3 dark:bg-gray-dark min-[350px]:min-w-[20rem]"
      >
        <div className="mb-1 flex items-center justify-between px-2 py-1.5">
          <span className="text-lg font-medium text-dark dark:text-white">
            Notifications
          </span>
          <span className="rounded-md bg-primary px-[9px] py-0.5 text-xs font-medium text-white">
            {notificationList.length} new
          </span>
        </div>

        <ul className="mb-3 max-h-[23rem] space-y-1.5 overflow-y-auto">
          {notificationList.length === 0 ? (
            <li className="p-2 text-sm text-gray-500">No notifications</li>
          ) : (
            notificationList.map((item, index) => (
              <li key={index} role="menuitem">
                <div className="flex flex-col gap-2 rounded-lg px-2 py-1.5">
                  <strong className="block text-sm font-medium text-dark dark:text-white">
                    {item.type || "Notification"} - {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ""}
                  </strong>
                  {item.source && (
                    <span className="text-xs text-gray-500">Source: {item.source}</span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-xs text-gray-500">Count: {item.count}</span>
                  )}
                  {item.newSwap && (
                    <div className="bg-yellow-100 text-yellow-900 rounded p-2">
                      <strong>🆕 NEW SWAP DETECTED!</strong><br />
                      Block: {item.newSwap.blockNumber ?? item.newSwap.block_number ?? "N/A"} | TX: {item.newSwap.transactionHash ?? item.newSwap.transaction_hash ? (item.newSwap.transactionHash ?? item.newSwap.transaction_hash)?.slice(0, 20) + "..." : "N/A"}
                    </div>
                  )}
                  {item.data && item.data.length > 0 ? (
                    <div>
                      {item.data.slice(0, 3).map((swap, i) => (
                        <div key={i} className="border-b border-gray-200 py-1 text-xs">
                          <strong>Block {swap.blockNumber ?? swap.block_number ?? "N/A"}</strong> - Amount0: {swap.amount0 ?? "N/A"} | Amount1: {swap.amount1 ?? "N/A"} | Pool: {swap.poolAddress ? swap.poolAddress.slice(0, 10) + "..." : "N/A"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No swap data available</span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>

        <Link
          href="#"
          onClick={() => setIsOpen(false)}
          className="block rounded-lg border border-primary p-2 text-center text-sm font-medium tracking-wide text-primary outline-none transition-colors hover:bg-blue-light-5 focus:bg-blue-light-5 focus:text-primary focus-visible:border-primary dark:border-dark-3 dark:text-dark-6 dark:hover:border-dark-5 dark:hover:bg-dark-3 dark:hover:text-dark-7 dark:focus-visible:border-dark-5 dark:focus-visible:bg-dark-3 dark:focus-visible:text-dark-7"
        >
          See all notifications
        </Link>
      </DropdownContent>
    </Dropdown>
  );
}
