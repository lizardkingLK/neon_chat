import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

type GroupState = {
  id: string;
  name: string;
  groupId: string;
};

type UserState = {
  id: string;
  username: string;
};

type ChatMessageState = {
  content: string;
  createdOn: string;
  createdBy: UserState;
  group: GroupState;
};

export async function POST(request: NextRequest) {
  const { content, createdOn, createdBy, group } =
    (await request.json()) as unknown as ChatMessageState;

  if (!(content && createdOn && createdBy && group)) {
    return NextResponse.json(
      { message: "error. request body invalid" },
      { status: 500 }
    );
  }

  const userRecord = await prisma.user.findUnique({
    where: { userId: createdBy.id },
  });
  if (!userRecord) {
    return NextResponse.json(
      { message: "error. user was not found" },
      { status: 500 }
    );
  }

  const groupRecord = await prisma.group.findUnique({
    where: { groupId: group.groupId },
  });
  if (!groupRecord) {
    return NextResponse.json(
      { message: "error. group was not found" },
      { status: 500 }
    );
  }

  const message = await prisma.message.create({
    data: {
      Content: content,
      authorId: userRecord?.id,
      groupId: groupRecord?.id,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
