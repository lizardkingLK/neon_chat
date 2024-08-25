import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

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
    await prisma.user.create({ data: { userId: user.id } });
  }

  return NextResponse.json({ user }, { status: 200 });
}
