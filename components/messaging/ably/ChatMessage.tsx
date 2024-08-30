import Link from "next/link";
import React, { memo } from "react";
import CustomTooltip from "../../tooltip";
import { MessageState } from "@/types/client";
import { dateFormatterOptions, timeFormatterOptions } from "@/constants";

function ChatMessage({ dataBody }: MessageState) {
  // global state vars
  const createdOnDate = new Date(Number(dataBody?.createdOn));
  const username = dataBody?.Author.username!;

  return (
    <div className="m-4">
      <p className="bg-secondary text-primary p-4 rounded-sm whitespace-pre-line">
        {dataBody?.content}
      </p>
      <div className="flex justify-end mt-2">
        <small>
          <Link href={`/profile/${username}`}>
            <span className={"hover:text-primary transition delay-50"}>
              @{username}
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
