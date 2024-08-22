import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse/node";

const prisma = new PrismaClient().$extends(
  withPulse({ apiKey: process.env.NEXT_PUBLIC_PULSE_API_KEY! })
);

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  async function listen() {
    // Create a stream from the 'User' model
    const stream = await prisma.user.stream({ name: "user-stream" });
    const groups = await prisma.group.count();

    console.log({ groups });

    for await (const event of stream) {
      console.log("Just received an event:", event);
    }
  };

  listen();

  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
