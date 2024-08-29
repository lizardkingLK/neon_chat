import { currentUser } from "@clerk/nextjs/server";
import Ably from "ably";

export const revalidate = 0;

export async function GET() {
  const user = await currentUser();
  const username = user?.username!;

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: username,
  });
  
  console.log(`Request: ${JSON.stringify(tokenRequestData)}`);

  return Response.json(tokenRequestData);
}
