import React from "react";
import dynamic from "next/dynamic";

const Messaging = dynamic(() => import("@/components/messaging/ably/ChatComponent"), {
  ssr: false,
});

const Chat = () => {
  return <Messaging />;
};

export default Chat;
