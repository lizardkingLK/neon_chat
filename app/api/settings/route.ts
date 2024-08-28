import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const include = {
  Owner: true,
};

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
  const { username } = (await currentUser())!;
  if (!username) {
    return errors.invalidParams;
  }

  const userRecord = await prisma.user.findUnique({ where: { username } });
  if (!userRecord) {
    return errors.userNotFound;
  }

  let settingsRecord = await prisma.settings.findFirst({
    where: { ownerId: userRecord.id },
    include,
  });
  if (!userRecord) {
  }
  settingsRecord = await prisma.settings.create({
    data: {
      ownerId: userRecord.id,
    },
    include,
  });

  return NextResponse.json({ data: settingsRecord }, { status: 200 });
}
