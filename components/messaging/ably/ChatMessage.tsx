import { ChatMessageState } from "@/types/client";
import Link from "next/link";
import React, { memo } from "react";
import CustomTooltip from "../../tooltip";
import { cn } from "@/lib/utils";
import { useOnlineSetStore } from "./ChatOnlineState";

const dateFormatterOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const timeFormatterOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

function ChatMessage({ content, createdOn, createdBy }: ChatMessageState) {
  // global state vars
  const presenceSet = useOnlineSetStore((state) => state.onlineSet);

  const createdOnDate = new Date(Number(createdOn));

  return (
    <div className="m-4">
      <p className="bg-secondary text-primary p-4 rounded-sm">{content}</p>
      <div className="flex justify-end mt-2">
        <small>
          <Link href={`/profile/${createdBy.username}`}>
            <span
              className={cn(
                presenceSet.includes(createdBy.username) && "text-green-500",
                "hover:text-primary transition delay-50"
              )}
            >
              @{createdBy.username}
            </span>
          </Link>{" "}
          <CustomTooltip
            trigger={
              <span className="text-gray-500 hover:text-primary transition delay-50">
                {createdOnDate.toLocaleString("en-us", dateFormatterOptions)}
              </span>
            }
            content={
              <span>
                {createdOnDate.toLocaleString("en-us", timeFormatterOptions)}
              </span>
            }
          />
        </small>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
