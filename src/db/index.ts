import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chatsTable, messagesTable } from "./schema";
import { and, eq, desc } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle({ client });

// chats
export const createChat = async (
  title: string,
  useId: string,
  model: string
) => {
  try {
    const [newChat] = await db
      .insert(chatsTable)
      .values({
        title,
        useId,
        model,
      })
      .returning();
    return newChat;
  } catch (error) {
    console.log("err creating chat", error);
    return null;
  }
};

export const getChat = async (chatId: number, useId: string) => {
  try {
    const chat = await db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.useId, useId)));

    if (chat.length === 0) {
      return null;
    }
    return chat[0];
  } catch (error) {
    console.log("err getting chat", error);
    return null;
  }
};

export const getChats = async (useId: string) => {
  try {
    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.useId, useId))
      .orderBy(desc(chatsTable.id));
      return chats
  } catch (error) {
    console.log("err getting chats", error);
    return null;
  }
};

//message
export const createMessage = async (
  chat_id: number,
  content: string,
  role: string
) => {
  try {
    const [newMessage] = await db
      .insert(messagesTable)
      .values({
        content: content,
        chatId: chat_id,
        role: role,
      })
      .returning();
    return newMessage;
  } catch (error) {
    console.log("err createMessage", error);
    return null;
  }
};


export const getMessageByChatId = async (chatId: number) => {
  try {
    const message = await db
      .select()
      .from(messagesTable)
      .where(and(eq(messagesTable.chatId, chatId)));

    return message;
  } catch (error) {
    console.log("err getMessageChatId", error);
    return null;
  }
};

