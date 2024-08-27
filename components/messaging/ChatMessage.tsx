import { ChatMessageState } from "@/types/client";
import Link from "next/link";
import React from "react";
import CustomTooltip from "../tooltip";

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
  const createdOnDate = new Date(Number(createdOn));

  return (
    <div className="m-4">
      <p className="bg-secondary text-primary p-4 rounded-sm">{content}</p>
      <div className="flex justify-end mt-2">
        <small className="text-gray-500">
          <Link href={`/profile/${createdBy.username}`}>
            <span className="hover:text-primary transition delay-50">
              @{createdBy.username}
            </span>
          </Link>{" "}
          <CustomTooltip
            trigger={
              <span className="hover:text-primary transition delay-50">
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

export default ChatMessage;
