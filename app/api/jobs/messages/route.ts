import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const queryFilter = {
  where: {
    Author: {
      Settings: {
        expiringMessages: true,
      },
    },
  },
};

const currentTimeAsNumber = new Date().getTime();

const getOlderThan24 = ({ createdOn }: { createdOn: string }) => {
  const createdOnAsNumber = createdOn ? Number(createdOn) : currentTimeAsNumber;

  return currentTimeAsNumber - createdOnAsNumber >= 86400000;
};

const deleteResponse = NextResponse.json({ success: true }, { status: 200 });

// Deletes messages that are older than 24hrs
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { message: "error. unauthorized" },
      {
        status: 401,
      }
    );
  }

  const nonExpiredMessages = await prisma.message.findMany(queryFilter);
  if (!nonExpiredMessages) {
    return;
  }

  const messageIdsToDelete = nonExpiredMessages
    .filter(getOlderThan24)
    .map(({ id }) => id);

  await prisma.message.deleteMany({
    where: {
      id: {
        in: messageIdsToDelete,
      },
    },
  });

  return deleteResponse;
}
