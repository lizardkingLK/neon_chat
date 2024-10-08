"use client";

import React from "react";
import dynamic from "next/dynamic";

const Messaging = dynamic(() => import("@/components/messaging/ably"), {
  ssr: false,
});

const Chat = () => {
  return <Messaging />;
};

export default Chat;
