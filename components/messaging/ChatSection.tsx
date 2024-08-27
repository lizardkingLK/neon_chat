import { ChatMessageState, GetGroupResponse, GroupState } from "@/types/client";
import { User } from "@clerk/nextjs/server";
import { Message, PresenceMessage } from "ably";
import {
  useChannel,
  useConnectionStateListener,
  usePresence,
  usePresenceListener,
} from "ably/react";
import React, { useEffect,  useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { Textarea } from "../ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useOnlineSetStore, useOnlineSetStoreManager } from "./ChatOnlineState";

// read only vars
const messageEvent = "first";
const defaultChannel = "get-started";
const stringEmpty = "";
const activePresence = ["enter", "present", "update"];
const defaultGroup = {
  groupId: "N_CHAT",
  name: "NEON CHAT",
};

function ChatScreen() {
  // ref vars
  const scrollRef = useRef<HTMLDivElement>(null);

  // state vars
  const [isLoading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupState | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messageText, setMessageText] = useState(stringEmpty);
  const [messages, setMessages] = useState<Message[]>([]);

  // global state vars
  const presenceSet = useOnlineSetStore((state) => state.onlineSet)
  const insertPresence = useOnlineSetStoreManager((state) => state.insert);
  const deletePresence = useOnlineSetStoreManager((state) => state.delete);

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
          setMessages(
            groupMessages.reverse().map((item) => ({
              userId: item.messageId,
              data: item,
            }))
          );
        }
      });
  };

  const handlePresenceChange = (presenceData: PresenceMessage) => {
    const { action, clientId } = presenceData;

    if (activePresence.includes(action) && !presenceSet.includes(clientId)) {
      insertPresence(clientId);
    } else if (
      !activePresence.includes(action) &&
      presenceSet.includes(clientId)
    ) {
      deletePresence(clientId);
    }
  };

  // Listen to connection status
  useConnectionStateListener("connected", () => {
    console.log("Connected to Ably!");
  });

  // Create a channel called defaultChannel and subscribe to all messages with the name 'first' using the useChannel hook
  const { channel } = useChannel(defaultChannel, messageEvent, (message) => {
    setMessages((previousMessages) => [...previousMessages, message]);
  });

  // Publishes presence event
  usePresence({
    channelName: defaultChannel,
    onChannelError: (error) => console.log({ error }),
    onConnectionError: (error) => console.log({ error }),
  });

  // Listens to presence events
  usePresenceListener(defaultChannel, handlePresenceChange);

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
    setMessageText(stringEmpty);
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      await loadMessages(defaultGroup);
      setLoading(false);
    };

    initialize();
  }, []);

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
    <section>
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
          type="submit"
          className={cn("w-full", buttonVariants({ variant: "secondary" }))}
          onClick={handlePublish}
        >
          Send
        </Button>
      </div>
    </section>
  );
}

export default ChatScreen;
