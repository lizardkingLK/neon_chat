import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MessageType } from "@/types/client";

const prisma = new PrismaClient();

const include =  {
  Author: true,
  Group: true,
}

const errors = {
  invalidParams: () =>
    NextResponse.json({ message: "error. invalid parameters" }, { status: 500 }),
  invalidBody: () =>
    NextResponse.json({ message: "error. invalid body" }, { status: 500 }),
};

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get("groupId"),
    page = request.nextUrl.searchParams.get("page");

  if (groupId === null || page === null) {
    return errors.invalidParams();
  }

  const data = await prisma.message.findMany({
    where: {
      groupId: Number(groupId),
    },
    include,
    orderBy: {
      createdOn: "desc",
    },
    skip: Number(page) * 5,
    take: 5,
  });

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { content, createdOn, authorId, groupId } =
    (await request.json()) as unknown as MessageType;

  if (!(content && createdOn && authorId && groupId)) {
    return errors.invalidBody();
  }

  const message = await prisma.message.create({
    data: {
      content,
      createdOn,
      authorId: authorId,
      groupId: groupId,
    },
    include,
  });

  return NextResponse.json({ message }, { status: 201 });
}
