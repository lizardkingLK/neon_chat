import { UserState } from "@/types/client";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const errors = {
  invalidParams: () =>
    NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    ),
  userNotFound: () =>
    NextResponse.json(
      { message: "error. user was not found" },
      { status: 404 }
    ),
};

export async function GET() {
  const user = (await currentUser())!;

  const userRecord = await prisma.user.findUnique({
    where: { userId: user.id },
  });
  if (!userRecord) {
    const username =
      user.username ?? `${user.firstName}${user.lastName}${user.id}`;
    await prisma.user.create({ data: { userId: user.id, username } });
  }

  return NextResponse.json(
    {
      user: {
        clerkBody: user,
        prismaBody: userRecord,
      } as UserState,
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const { username } = await request.json();
  if (!username) {
    return errors.invalidParams();
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return errors.userNotFound();
  }

  const extendedUser = await clerkClient().users.getUser(user?.userId);
  if (!extendedUser) {
    return errors.userNotFound();
  }

  return NextResponse.json({ user: extendedUser }, { status: 200 });
}
