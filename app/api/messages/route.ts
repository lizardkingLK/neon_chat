import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { MessageType } from "@/types/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get("groupId"),
    page = request.nextUrl.searchParams.get("page");

  if (groupId === null || page === null) {
    return NextResponse.json(
      { message: "error. invalid params" },
      { status: 500 }
    );
  }

  const group = await prisma.group.findUnique({
    where: { groupId },
  });
  if (!group) {
    return NextResponse.json(
      { message: "error. group was not found" },
      { status: 404 }
    );
  }

  const data = await prisma.message.findMany({
    where: {
      groupId: group.id,
    },
    include: {
      Author: true,
      Group: true,
    },
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
    return NextResponse.json(
      { message: "error. request body invalid" },
      { status: 500 }
    );
  }

  const message = await prisma.message.create({
    data: {
      content,
      createdOn,
      authorId: authorId,
      groupId: groupId,
    },
    include: {
      Author: true,
      Group: true,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
