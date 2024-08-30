import React, { useCallback, useEffect, useRef, useState } from "react";
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
import {
  useSettingsStore,
  useSettingsStoreManager,
} from "@/components/navbar/SettingsState";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [separator, setSeparator] = useState(false);

  // global state vars
  const onlineSet = useOnlineSetStore((state) => state.onlineSet);
  const updateOnlineSet = useOnlineSetStoreManager(
    (state) => state.updateOnlineSet
  );
  const autoScroll = useSettingsStore((state) => state.autoScroll);
  const initializeSettings = useSettingsStoreManager(
    (state) => state.initializeSettings
  );

  const loadUser = useCallback(async () => {
    await fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        const user = data?.user as UserState;
        if (user) {
          setUser(user);
        }

        const settings = user?.prismaBody?.Settings;
        if (settings) {
          initializeSettings(settings);
        }
      });
  }, [initializeSettings]);

  const pageMessages = async (pageNo: number) => {
    await fetch(`/api/messages?groupId=${group?.id}&page=${pageNo}`)
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

    if (activePresence.includes(action)) {
      updateOnlineSet([...onlineSet, clientId]);
    } else if (!activePresence.includes(action)) {
      updateOnlineSet(onlineSet.filter((item) => item !== clientId));
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

    const isSameUser =
      newMessage.dataBody?.Author.username === user?.prismaBody?.username;

    setMessages((previousMessages) => {
      let messages = previousMessages;
      let separators: MessageState[] = [];

      if (!autoScroll && !separator) {
        separators = [
          {
            dataBody: null,
            liveBody: null,
            separator: { id: `new_messages_${unreadCount}` },
          },
        ];

        messages = previousMessages.filter((item) => !item.separator);

        if (!isSameUser) {
          setSeparator(true);
        }
      }

      const newMessages = [...messages, ...separators, newMessage];

      return newMessages;
    });

    handleScrolling(true, isSameUser);
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
    if (!messageText) {
      console.log("error. message content is empty");
      return;
    }

    handleMessage();
    handleScrolling();
    handleClear();
    handleCleanSeparator();
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

  const handleScrolling = (checkOption?: boolean, sameUser?: boolean) => {
    if (checkOption && !autoScroll && !sameUser) {
      setUnreadCount((previousValue) => previousValue + 1);
      return;
    }

    if (scrollRefEnd.current) {
      scrollRefEnd.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  };

  const handleCleanSeparator = () => {
    setUnreadCount(0);
    setMessages((previousMessages) =>
      previousMessages.filter((item) => !item.separator)
    );
    setSeparator(false);
  };

  const handleMarkAsRead = () => {
    handleScrolling();
    handleCleanSeparator();
  };

  const handleClear = () => {
    setUnreadCount(0);
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
    const initialize = async (finishInitializing: () => void) => {
      await loadUser();
      await loadMessages(defaultGroup);
      finishInitializing();
    };

    initialize(() => setInitializing(false));
  }, [loadUser]);

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
      <div className="flex items-center space-x-4 mx-4 min-w-max">
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full h-10"
          onClick={handleLoadMore}
        >
          <ChevronUp />
        </Button>
        {unreadCount > 0 && !autoScroll && (
          <Button
            size={"icon"}
            type="button"
            className="animate-bounce relative inline-flex items-center p-3 text-sm font-medium text-center text-primary bg-secondary rounded-lg hover:bg-secondary dark:bg-secondary"
            onClick={handleMarkAsRead}
          >
            <ChatBubbleIcon />
            <span className="sr-only">Notifications</span>
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              {unreadCount}
            </div>
          </Button>
        )}
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
            const dataBody = message.dataBody;
            if (dataBody) {
              return (
                <li key={dataBody.id}>
                  <ChatMessage {...message} />
                </li>
              );
            } else if (separator && message.separator) {
              return (
                <div
                  key={message.separator.id}
                  className="flex space-x-4 justify-center items-center"
                >
                  <p className="text-green-500">
                    {" "}
                    {unreadCount} New Message(s)
                  </p>
                </div>
              );
            }
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
