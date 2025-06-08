"use client";
import { ChatModel } from "@/db/schema";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Navibar() {
  //获取登录信息
  const { user } = useUser();
  const router = useRouter();
  //使用useQuery读取后端数据
  const { data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: () => {
      return axios.post("/api/get-chats");
    },
    enabled: !!user?.id,
  });

  //当前路径高亮
  const pathname = usePathname();
  //登出
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      // 可选：在登出后重定向用户到登录页或首页
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  //登陆页面没有导航栏
  const isntSee = { path: "/sign-in" };
  if (pathname == isntSee.path) {
    return <div></div>;
  }
  const isntSee2 = { path: "/sign-in/create/verify-email-address" };
  if (pathname == isntSee2.path) {
    return <div></div>;
  }
  const isntSee3 = { path: "/sign-in/factor-one" };
  if (pathname == isntSee3.path) {
    return <div></div>;
  }

  // 暂时有3个邮箱
  // 2798605781@qq.com 2798605781  *****  hpj2798605781@163.com 2798605781 **** 1144241903@qq.com 1144241903
  return (
    <div className="w-1/5 h-screen bg-gray-50">
      <div className="h-4"></div>
      <div className="flex flex-col h-9/10 bg-gray-50">
        <div className="flex items-center justify-center">
          <p className="font-bold text-2xl">Deepseek</p>
        </div>
        <div
          className="h-10 flex items-center justify-center mt-4
      cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          <p
            className="h-full w-2/3 bg-blue-100 rounded-lg flex items-center
        justify-center font-thin"
          >
            创建新会话
          </p>
        </div>
        <div className="h-4"></div>
        {/* 目录 */}
        <div
          className="flex flex-col items-center justify-center gap-2 
        inline-block overflow-hidden text-2xl  whitespace-nowrap"
        >
          {chats?.data?.map((chat: ChatModel) => (
            <div
              className="w-full h-10"
              key={chat.id}
              onClick={() => {
                router.push(`/chat/${chat.id}`);
              }}
            >
              <div
                className="h-10 flex items-center justify-center mt-4
      cursor-pointer"
              >
                <p
                  className={`h-full w-2/3 bg-blue-100 rounded-lg flex items-center
         font-thin overflow-hidden whitespace-nowrap text-ellipsis justify-around text-xl
        ${pathname === `/chat/${chat.id}` ? "text-blue-700" : ""}`}
                dir="rtl"
                >
                  {chat.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-10 flex flex-col items-center justify-center mt-4 cursor-pointer">
        <button
          className="h-full w-2/3 bg-blue-700 rounded-lg flex items-center
        justify-center font-thin"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
