This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## 首先 登录功能
在clerk.com里面创建一个application用邮箱的，按照文件配置就行
但在layout.tsx时只要一个    <ClerkProvider>组件包裹就行
npm install @clerk/nextjs

项目目录下的.env

\##clerk的公钥和私钥

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZnJlZS1tYWdnb3QtNS5jbGVyay5hY2NvdW50cy5kZXYk

CLERK_SECRET_KEY=sk_test_Ff2DtIzfadYepoDkwJmV7ajNTpxaTY7eLf1MUQMBBu
```

在src/middleware.ts
$$
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'



const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])



export default clerkMiddleware(async (auth, req) => {

  //如果不是一个pubilc路径的话会跳转到保护页面

 if (!isPublicRoute(req)) {

  await auth.protect()

 }

})



export const config = {

 matcher: [

  // Skip Next.js internals and all static files, unless found in search params

  '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

  // Always run for API routes

  '/(api|trpc)(.*)',

 ],

}
$$
在src/app/layout.tsx

```

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased 
        flex flex-row`}
        >
          <div className="w-1/5 h-screen bg-gray-50">
            <Navibar />
          </div>
          <div className="w-4/5 h-screen">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

在src创建app/sign/[[...sign-in]]/page.tsx

```
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='h-screen w-screen flex items-center justify-center'>
  <SignIn />
  </div>

}
```



在.env指定一下sign是登录页面

```

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```



## 首页
安装Material ui
https://mui.com/material-ui/material-icons

npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

/app/page.tsx

```
"use client";
import Image from "next/image";
import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
export default function Home() {
  const [input, setInput] = useState(""); //输入框
  const [model, setModel] = useState("deepseek-v3");
    const handleChangeModel = ()=>{
    setModel(model==='deepseek-v3'?'deepseek-r1':'deepseek-v3')
  }
  return (
    <div className="h-screen flex flex-col items-center">
      <div className="h-1/5"></div>
      <div className="w-1/2">
        <p className="text-bold text-2xl text-center">有什么可以帮你的</p>
        <div
          className="flex flex-col items-center justify-center mt-4 
shadow-lg border-[1px] border-gray-300 h-32 rounded-lg"
        >
          <textarea
            className="w-full rounded-lg p-3 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
            <div
              className={`flex flex-row items-center justify-center rounded-lg border-[1px]
            px-2 py-1 ml-2 cursor-pointer 
            ${
              model === "deepseek-r1"
                ? "border-blue-300 bg-blue-200"
                : "border-gray-300"
            }`}
            onCanPlay={handleChangeModel}
            >
              <p className="text-sm">深度思考{model} </p>
            </div>
            <div
              className="flex items-center justify-center border-2 mr-4 border-black p-1 
          rounded-full"
            >
              <EastIcon></EastIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```



## 聊天页
https://ai-sdk.dev/providers/ai-sdk-providers/deepseek
安装ai
npm i ai
npm install @ai-sdk/deepseek

https://ai-sdk.dev/docs/ai-sdk-ui/chatbot#chatbot
页面前端

创建src/app/chat/[chat_id]/page.tsx

```
"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import EastIcon from "@mui/icons-material/East";
export default function Page() {
  //信息，输入框内容，输入框改变函数，提交函数
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
  //信息滑动
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endRef.current) {
      endRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [model, setModel] = useState("deepseek-v3");
  const handleChangeModel = ()=>{
    setModel(model==='deepseek-v3'?'deepseek-r1':'deepseek-v3')
  }

  return (
    <div className="flex flex-col h-screen justify-between items-center">
      <div
        className="flex flex-col w-2/3 gap-8 overflow-y-auto
         justify-between flex-1"
      >
        <div className="h-4" ref={endRef}></div>
        <div className="flex flex-col gap-8 flex-1">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`rounded-lg flex flex-row 
            ${
              message?.role === "assistant"
                ? "justify-start mr-18 "
                : "justify-end ml-10"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                message?.role === "assistant" ? "bg-blue-300" : "bg-slate-100"
              }`}
            >
              {message?.content}
            </p>
          </div>
        ))}
        </div>

      </div>
      <div className="h-4" ref={endRef}></div>
      {/*输入框*/ }
      <div
        className="flex flex-col items-center justify-center mt-4 
shadow-lg border-[1px] border-gray-300 h-32 rounded-lg w-2/3"
      >
        <textarea
          className="w-full rounded-lg p-3 focus:outline-none"
          value={input}
          onChange={handleInputChange}
        ></textarea>
        <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
          <div
            className={`flex flex-row items-center justify-center rounded-lg border-[1px]
            px-2 py-1 ml-2 cursor-pointer 
            ${
              model === "deepseek-r1"
                ? "border-blue-300 bg-blue-200"
                : "border-gray-300"
            }`}
            onClick={handleChangeModel}
          >
            <p className="text-sm">深度思考{model} </p>
          </div>
          <div
            className="flex items-center justify-center border-2 mr-4 border-black p-1 
          rounded-full"
          onClick={handleSubmit}
          >
            <EastIcon></EastIcon>
          </div>
        </div>
      </div>
    </div>
  );
}

```



## 接入对话
先去阿里云百联创建好apikey并从产品文档找到baseurl

在.env

```
##阿里云配置

DEEPSEEK_API_KEY="sk-2e714e310ac545c993843afef367f284"

BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
```

然后在app/api/chat/route.ts

```
import { createDeepSeek } from '@ai-sdk/deepseek';

import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds

export const maxDuration = 30;

const deepseek = createDeepSeek({

  apiKey:process.env.DEEPSEEL_API_KEY,

  baseURL:process.env.BASE_URL

})

export async function POST(req: Request) {

 const { messages } = await req.json();



 const result = streamText({

  model: deepseek('deepseek-v3'),

  system: 'You are a helpful assistant.',

  messages,

 });



 return result.toDataStreamResponse();

}
```



##  接入数据库

[Supabase | The Open Source Firebase Alternative](https://supabase.com/)

创建一个项目deepseek然后保存data password创建成功后

JYff3DnEpDv9bibQ

点击connect保存下来postgresql

postgresql://postgres:[YOUR-PASSWORD]@db.luwhhgnmaietpebwqspy.supabase.co:5432/postgres



[Drizzle ORM - next gen TypeScript ORM.](https://orm.drizzle.team/)

npm i drizzle-orm postgres dotenv
npm i -D drizzle-kit tsx



[Drizzle ORM - PostgreSQL](https://orm.drizzle.team/docs/get-started/supabase-new)

在.env

DATABASE_URL=postgresql://postgres:JYff3DnEpDv9bibQ@db.luwhhgnmaietpebwqspy.supabase.co:5432/postgres

在src/db/index.ts

```
import { integer, pgTable, serial, text, varchar, } from "drizzle-orm/pg-core";

export const chatsTable = pgTable("chats", {
  id: serial("id").primaryKey(),
  useId: text("use_id").notNull(),
  title: text("use_id").notNull(),
  model:text("model").notNull()
});
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").references(()=>chatsTable.id),
  role: text("role").notNull(),
  content:text("content").notNull()
});

//传参用的
export type ChatModel = typeof chatsTable.$inferSelect
export type MessagesModel = typeof messagesTable.$inferSelect

```

在项目目录配置文件drizzle.config.ts

```
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

```

在终端

npx drizzle-kit push会报错哈哈啊哈getaddrinfo ENOTFOUND db.luwhhgnmaietpebwqspy.supabase.co

或npx drizzle-kit generate



在db/index

```
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { chatsTable, messagesTable } from "./schema";
import { and, eq, desc } from "drizzle-orm";
import { equal } from "assert";
import { useId } from "react";

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


export const getMessage = async (chatId: number) => {
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


```

##  导航栏

npm i @tanstack/react-query

npm i axios

用户登出

在一个集成了 Clerk 的 Next.js 项目中，可以通过调用 Clerk 提供的 API 来退出用户的 session。

导入 Clerk 的 hooks 或 API 方法：需要从 Clerk SDK 中导入相应的函数或 hooks 来处理退出操作。通常使用的是 useClerk hook。

调用 signOut 方法：useClerk hook 提供了 signOut 方法，用于终止当前的 session。可以在一个按钮点击事件或其他触发事件中调用这个方法。

这里是一个示例代码，展示了如何在 Next.js 页面或组件中实现登出功能：

————————————————

                     import { useClerk } from '@clerk/nextjs';
    
    export default function LogoutButton() {
      const { signOut } = useClerk();
    
      const handleLogout = async () => {
        try {
          await signOut();
          // 可选：在登出后重定向用户到登录页或首页
          window.location.href = '/';
        } catch (error) {
          console.error('Logout failed', error);
        }
      };
    
      return (
        <button onClick={handleLogout}>
          Logout
        </button>
      );
    }
    
                     版权声明：本文为博主原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。

原文链接：https://blog.csdn.net/solocao/article/details/141197392