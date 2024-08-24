"use client";

import React, { useRef, useState } from "react";
import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const client = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
});

export default function Chat() {
  return (
    <main className="min-h-screen">
      <AblyProvider client={client}>
        <ChannelProvider channelName="get-started">
          <ChatScreen />
        </ChannelProvider>
      </AblyProvider>
    </main>
  );
}

type UserState = {
  id: number;
  firstName: string;
};

type ChatMessageState = {
  content: string;
  createdOn: string;
  createdBy: UserState;
};

const dateFormatterOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const ChatMessage = ({ content, createdOn, createdBy }: ChatMessageState) => {
  return (
    <div className="m-4">
      <p className="bg-secondary text-primary p-4 rounded-sm">{content}</p>
      <div className="flex justify-end">
        <small className="text-gray-500">
          @{createdBy.firstName}{" "}
          {new Date(createdOn).toLocaleString("en-us", dateFormatterOptions)}
        </small>
      </div>
    </div>
  );
};

function ChatScreen() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserState>({
    id: 1,
    firstName: "Sandeep",
  });
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Ably.Message[]>([]);

  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel("get-started", "first", (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  const handlePublish = async () => {
    handleSave();
    handleSend();
    handleRender();
    handleClear();
  };

  const handleSave = async () => {};

  const handleSend = () => {
    channel.publish("first", {
      content: messageText,
      createdOn: new Date().toDateString(),
      createdBy: user,
    } as ChatMessageState);
  };

  const handleRender = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  const handleClear = () => {
    setMessageText("");
  };

  return (
    // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
    <div className="w-full">
      <div className="flex items-center mx-4 h-[calc(10vh)]">
        <h1 className="font-black text-4xl">NEON</h1>
      </div>
      <ScrollArea className="h-[calc(70vh)] whitespace-nowrap rounded-md border mx-4">
        <ul>
          <li>
            <ChatMessage
              content="Hello Brother"
              createdBy={user}
              createdOn={new Date().toDateString()}
            />
          </li>
          {messages.map((message) => {
            const chatMessageData = message.data as ChatMessageState;
            return (
              <li key={message.id}>
                <ChatMessage {...chatMessageData} />
              </li>
            );
          })}
          <div className="h-24" ref={scrollRef}></div>
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mx-4 min-w-max mt-4 bottom-4">
        <Textarea
          placeholder="Type your message here."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>
      <div className="mx-4 mt-4 bottom-4">
        <Button className="w-full" onClick={handlePublish}>
          Send
        </Button>
      </div>
    </div>
  );
}
