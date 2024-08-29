import { GroupType } from "@/types/client";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const include: any = {
  Message: {
    include: {
      Author: true,
      Group: true,
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  },
};

export async function POST(request: NextRequest) {
  const { groupId, name } = (await request.json()) as GroupType;
  if (!(groupId && name)) {
    return NextResponse.json(
      { message: "error. request body invalid" },
      { status: 500 }
    );
  }

  let group = await prisma.group.findUnique({
    where: { groupId },
    include,
  });
  if (!group) {
    group = await prisma.group.create({
      data: { groupId, name },
      include,
    });
  }

  return NextResponse.json({ group }, { status: 200 });
}
