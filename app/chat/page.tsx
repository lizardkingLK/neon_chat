"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
import { Skeleton } from "@/components/ui/skeleton";
import CustomTooltip from "@/components/tooltip";
import Link from "next/link";
import { ChatMessageState, GetGroupResponse, GroupState } from "@/types/client";

// read only vars
const messageEvent = "first";
const defaultChannel = "get-started";
const defaultGroup = {
  groupId: "N_CHAT",
  name: "NEON CHAT",
};

const client = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
});

export default function Chat() {
  return (
    <main>
      <AblyProvider client={client}>
        <ChannelProvider channelName={defaultChannel}>
          <ChatScreen />
        </ChannelProvider>
      </AblyProvider>
    </main>
  );
}

const dateFormatterOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const timeFormatterOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const ChatMessage = ({ content, createdOn, createdBy }: ChatMessageState) => {
  const createdOnDate = new Date(Number(createdOn));

  return (
    <div className="m-4">
      <p className="bg-secondary text-primary p-4 rounded-sm">{content}</p>
      <div className="flex justify-end mt-2">
        <small className="text-gray-500">
          <Link target="_blank" href={`/profile/${createdBy.username}`}>
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
};

function ChatScreen() {
  // ref vars
  const scrollRef = useRef<HTMLDivElement>(null);

  // state vars
  const [isLoading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Ably.Message[]>([]);

  const loadUser = async () => {
    await fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data?.user);
        }
      });
  };

  const loadMessages = async (data: GroupState) => {
    await fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.group) {
          const group: GetGroupResponse = data?.group;
          setGroup(group);

          const groupMessages: ChatMessageState[] = group.Message.map(
            (item) => ({
              messageId: item.id.toString(),
              content: item.content,
              createdBy: {
                id: item.Author.userId,
                username: item.Author.username,
              },
              createdOn: item.createdOn,
              group: {
                groupId: group.groupId,
                name: group.name,
              },
            })
          );
          setMessages(groupMessages.map((item) => ({ userId: item.messageId, data: item })));
        }
      });
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      await loadMessages(defaultGroup);
      setLoading(false);
    };

    initialize();
  }, []);

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  // Create a channel called defaultChannel and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel(defaultChannel, messageEvent, (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  
// const { unsubscribe } = channel.presence.subscribe((event) => {
//   console.log(`${event.clientId} entered with data: ${event.data}`);
// });


  const handlePublish = async () => {
    handleMessage();
    handleRender();
    handleClear();
  };

  const handleMessage = async () => {
    if (!user?.username) {
      console.log("error. username invalid");
      return;
    }

    const message = {
      content: messageText,
      createdOn: new Date().getTime().toString(),
      createdBy: { id: user.id, username: user.username },
      group,
    } as ChatMessageState;

    fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message) {
          handleSend(message);
        }
      });
  };

  const handleSend = (message: ChatMessageState) => {
    channel.publish(messageEvent, message);
  };

  const handleRender = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const handleClear = () => {
    setMessageText("");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-[calc(70vh)] whitespace-nowrap rounded-md border mx-4" />
        <Skeleton className="h-[calc(10vh)] mx-4 min-w-max mt-4" />
        <Skeleton className="h-[calc(5vh)] mx-4 min-w-max mt-4" />
      </div>
    );
  }

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div>
      <ScrollArea className="h-[calc(70vh)] whitespace-nowrap rounded-md border mx-4">
        <ul>
          {messages.map((message) => {
            const chatMessageData = message.data as ChatMessageState;
            return (
              <li key={chatMessageData.messageId}>
                <ChatMessage {...chatMessageData} />
              </li>
            );
          })}
          {messages.length > 0 && <div className="h-24" ref={scrollRef}></div>}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mx-4 min-w-max mt-4">
        <Textarea
          placeholder="Type your message here."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>
      <div className="mx-4 mt-4">
        <Button
          className={cn("w-full", buttonVariants({ variant: "secondary" }))}
          onClick={handlePublish}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
