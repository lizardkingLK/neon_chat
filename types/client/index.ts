export type GetGroupResponse = {
  Message: ({
    Author: {
      id: number;
      userId: string;
      username: string;
    };
    Group: {
      id: number;
      groupId: string;
      name: string;
    };
  } & {
    id: number;
    content: string;
    createdOn: string;
    groupId: number;
    authorId: number;
  })[];
} & {
  id: number;
  groupId: string;
  name: string;
};

export type GroupState = {
  groupId: string;
  name: string;
};

export type UserState = {
  id: string;
  username: string;
};

export type ChatMessageState = {
  messageId: string;
  content: string;
  createdOn: string;
  createdBy: UserState;
  group: GroupState;
};
