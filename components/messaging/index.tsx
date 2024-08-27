import React from "react";
import { Realtime } from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import ChatSection from "./ChatSection";

const defaultChannel = "get-started";

const Messaging = () => {
  const client = new Realtime({
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  });

  return (
    <main>
      <AblyProvider client={client}>
        <ChannelProvider channelName={defaultChannel}>
          <ChatSection />
        </ChannelProvider>
      </AblyProvider>
    </main>
  );
};

export default Messaging;
