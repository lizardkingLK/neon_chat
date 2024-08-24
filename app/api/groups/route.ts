import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse/node";

const prisma = new PrismaClient().$extends(
  withPulse({ apiKey: process.env.NEXT_PUBLIC_PULSE_API_KEY! })
);

// To handle a GET request to /api
export async function GET(request: NextRequest) {


  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
