import { createMessage } from "@/db";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const deepseek = createDeepSeek({
  apiKey: process.env.BAILIAN_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_BAILIAN_BASE_URL,

});

export async function POST(req: Request) {
  const { messages, chat_id, chat_user_id } = await req.json();

  //消息存储
  //登录鉴权
  const { userId } = await auth();
  if (!userId || userId !== chat_user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  //存入用户消息
  const lastMessage = messages[messages.length - 1];
  await createMessage(chat_id, lastMessage.content, lastMessage.role);

  const result = streamText({
    model: deepseek("deepseek-v3"),
    system: "You are a helpful assistant.",
    messages,
    onFinish:async(result)=>{
        await createMessage(chat_id,result.text,'assistant')
    }
  });

  return result.toDataStreamResponse();
}
