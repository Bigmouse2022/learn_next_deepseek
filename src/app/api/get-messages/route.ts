import { getMessageByChatId } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { chat_id } = await req.json();
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({error:'unauthorized'}),{status:401})
  }

  const messages = await getMessageByChatId(chat_id);
      return new Response(JSON.stringify(messages),{status:200})
}
