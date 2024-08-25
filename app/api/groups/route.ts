import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type GroupState = {
  groupId: string;
  name: string;
};

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { groupId, name } = (await request.json()) as GroupState;

  if (!(groupId && name)) {
    return NextResponse.json(
      { message: "error. request body invalid" },
      { status: 500 }
    );
  }

  let group = await prisma.group.findUnique({
    where: { groupId },
  });
  if (!group) {
    group = await prisma.group.create({ data: { groupId, name } });
  }

  return NextResponse.json({ group }, { status: 200 });
}
