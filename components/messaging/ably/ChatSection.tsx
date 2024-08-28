import React, { useEffect, useRef, useState } from "react";
import {
  GroupResponse,
  GroupType,
  MessageResponse,
  MessageState,
  MessageType,
  UserState,
} from "@/types/client";
import { PresenceMessage } from "ably";
import {
  useChannel,
  useConnectionStateListener,
  usePresence,
  usePresenceListener,
} from "ably/react";
import { Skeleton } from "../../ui/skeleton";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { Textarea } from "../../ui/textarea";
import { Button, buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useOnlineSetStore, useOnlineSetStoreManager } from "./ChatOnlineState";
import { ChevronUp } from "lucide-react";
import CircularLoader from "@/components/loader/circular";

// read only vars
const messageEvent = "first";
const defaultChannel = "get-started";
const stringEmpty = "";
const activePresence = ["enter", "present", "update"];
const defaultGroup = {
  id: 1,
  groupId: "N_CHAT",
  name: "NEON CHAT",
  page: 1,
};

function ChatScreen() {
  // ref vars
  const scrollRefEnd = useRef<HTMLDivElement>(null);
  const scrollRefStart = useRef<HTMLDivElement>(null);
  const messageTextArea = useRef<HTMLTextAreaElement>(null);

  // state vars
  const [isInitializing, setInitializing] = useState(true);
  const [group, setGroup] = useState<GroupResponse | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [messageText, setMessageText] = useState(stringEmpty);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  // global state vars
  const presenceSet = useOnlineSetStore((state) => state.onlineSet);
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

  const pageMessages = async (pageNo: number) => {
    await fetch(`/api/messages?groupId=${group?.groupId}&page=${pageNo}`)
      .then((res) => res.json())
      .then((data) => {
        const result: MessageResponse[] | null = data?.data;
        if (result) {
          const groupMessages: MessageState[] = result
            .reverse()
            .map((item) => ({
              dataBody: item,
              liveBody: null,
            }));

          setMessages([...groupMessages, ...messages]);
        }
      });
  };

  const loadMessages = async (data: GroupType) => {
    await fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.group) {
          return;
        }

        const group: GroupResponse = data?.group;
        setGroup(group);

        const groupMessages: MessageState[] = group.Message.reverse().map(
          (item) => ({
            dataBody: item,
            liveBody: null,
          })
        );

        setMessages(groupMessages);
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

  const { channel } = useChannel(defaultChannel, messageEvent, (message) => {
    const newMessage: MessageState = {
      dataBody: message.data,
      liveBody: { ...message, data: null },
    };

    setMessages((previousMessages) => [...previousMessages, newMessage]);
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
    if (!(user?.clerkBody?.username && group?.id)) {
      console.log("error. username invalid");
      return;
    }

    const message = {
      authorId: user?.prismaBody?.id,
      content: messageText,
      createdOn: new Date().getTime().toString(),
      groupId: group.id,
    } as unknown as MessageType;

    fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((data) => {
        const newMessage: MessageResponse = data?.message;
        if (newMessage) {
          handleSend(newMessage);
        }
      });
  };

  const handleSend = (message: MessageResponse) => {
    channel.publish(messageEvent, message);
  };

  const handleRender = () => {
    if (scrollRefEnd.current) {
      scrollRefEnd.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const handleClear = () => {
    setMessageText(stringEmpty);

    if (messageTextArea.current) {
      messageTextArea.current.focus();
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);

    const newPage = page + 1;
    await pageMessages(page);
    setPage(newPage);

    if (scrollRefStart.current) {
      scrollRefStart.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
      await loadMessages(defaultGroup);
      setInitializing(false);
    };

    initialize();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-[calc(5vh)] mx-4 min-w-max mt-4" />
        <Skeleton className="h-[calc(60vh)] whitespace-nowrap rounded-md border mx-4" />
        <Skeleton className="h-[calc(10vh)] mx-4 min-w-max mt-4" />
        <Skeleton className="h-[calc(5vh)] mx-4 min-w-max mt-4" />
      </div>
    );
  }

  return (
    <section>
      <div className="mx-4 min-w-max">
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full"
          onClick={handleLoadMore}
        >
          <ChevronUp />
        </Button>
      </div>
      <ScrollArea className="h-[calc(60vh)] whitespace-nowrap rounded-md border mt-4 mx-4">
        {isLoading && (
          <div className="my-4">
            <div ref={scrollRefStart}></div>
            <CircularLoader />
          </div>
        )}
        <ul>
          {messages.map((message) => {
            const dataBody = message.dataBody!;
            return (
              <li key={dataBody.id}>
                <ChatMessage {...message} />
              </li>
            );
          })}
          {messages.length > 0 && (
            <div className="h-24" ref={scrollRefEnd}></div>
          )}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mx-4 min-w-max mt-4">
        <Textarea
          ref={messageTextArea}
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
