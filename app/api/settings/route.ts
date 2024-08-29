import { SettingsType } from "@/types/client";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
    return errors.invalidParams();
  }

  const userRecord = await prisma.user.findUnique({ where: { username } });
  if (!userRecord) {
    return errors.userNotFound();
  }

  let settings = await prisma.settings.findUnique({
    where: { ownerId: userRecord.id },
    include,
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        ownerId: userRecord.id,
      },
      include,
    });
  }

  return NextResponse.json({ settings }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { autoScroll, expiringMessages, id } =
    (await request.json()) as SettingsType;

  await prisma.settings.update({
    where: { id },
    data: {
      autoScroll,
      expiringMessages,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
