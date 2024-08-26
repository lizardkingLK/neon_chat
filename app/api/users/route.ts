import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// To handle a GET request to /api
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  const userRecord = await prisma.user.findUnique({
    where: { userId: user.id },
  });
  if (!userRecord) {
    const username =
      user.username ?? `${user.firstName}${user.lastName}${user.id}`;
    await prisma.user.create({ data: { userId: user.id, username } });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { username } = await request.json();
  if (!username) {
    return NextResponse.json(
      { message: "error. invalid parameters" },
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    return NextResponse.json(
      { message: "error. user not found" },
      { status: 404 }
    );
  }

  const extendedUser = await clerkClient().users.getUser(user?.userId);
  if (!extendedUser) {
    return NextResponse.json(
      { message: "error. user not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ user: extendedUser }, { status: 200 });
}
