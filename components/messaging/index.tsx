import React from "react";
import { Realtime } from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import ChatSection from "./ChatSection";

const defaultChannel = "get-started";

const Messaging = () => {
  const client = new Realtime({ authUrl: "/api/auth/messaging" });

  return (
    <section>
      <AblyProvider client={client}>
        <ChannelProvider channelName={defaultChannel}>
          <ChatSection />
        </ChannelProvider>
      </AblyProvider>
    </section>
  );
};

export default Messaging;
