"use client";

import Messaging from "@/components/messaging/ably/ChatComponent";

enum applicationTypes {
  // Ably
  ABL = "ABL",

  // Upstash
  URK = "URK",
}

const applicationType = process.env.NEXT_PUBLIC_APPLICATION_TYPE!;

const Chat = () => {
  if (applicationType === applicationTypes.ABL) {
    return (
        <Messaging />
    );
  }
};

export default Chat;
