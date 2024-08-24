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
          <AblyPubSub />
        </ChannelProvider>
      </AblyProvider>
    </main>
  );
}

function AblyPubSub() {
  const scrollRef = useRef<HTMLDivElement>(null);
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
    channel.publish("first", messageText);
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
          <li className="m-4">
            <p className="bg-secondary text-primary p-4 rounded-sm">
              Hello Brother
            </p>
            <div className="flex justify-end">
              <small className="text-gray-500">
                @Sandeep{" "}
                {new Date().toLocaleString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </small>
            </div>
          </li>
          {messages.map((message) => {
            return (
              <li key={message.id} className="p-4 m-4">
                <p>{message.data}</p>
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
