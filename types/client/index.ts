import { User } from "@clerk/nextjs/server";
import { Message } from "ably";

export type MessageType = {
  content: string;
  createdOn: string;
  groupId: number;
  authorId: number;
};

export type GroupType = {
  id: number;
  groupId: string;
  name: string;
};

export type AuthorType = {
  id: number;
  userId: string;
  username: string;
};

export type MessageResponse = {
  Author: AuthorType;
  Group: GroupType;
} & {
  id: number;
} & MessageType & { isAuthorMessage?: boolean };

export type MessageState = {
  liveBody: Message | null;
  dataBody: MessageResponse | null;
  separator?: { id: string };
};

export type UserType = {
  id: number;
  userId: string;
  username: string;
};

export type UserState = {
  clerkBody: User | null;
  prismaBody:
    | (UserType & {
        Settings: SettingsType | null;
      })
    | null;
};

export type GroupResponse = {
  Message: MessageResponse[];
} & GroupType;

export type SettingsType = {
  id: number;
  autoScroll: boolean;
  ownerId: number;
  expiringMessages: boolean;
  enterIsSend: boolean;
};

export type SettingsResponse = {
  Owner: UserType;
} & SettingsType;
