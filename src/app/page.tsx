"use client";
import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navibar from "./compoents/Navibar";
export default function Home() {
  const [input, setInput] = useState(""); //输入框
  const [model, setModel] = useState("deepseek-v3");
  const handleChangeModel = () => {
    setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3");
  };
  //创建消息的方法
  // 创建一个 client
  const queryClient = useQueryClient();
  const router = useRouter();

  //用户是否完成登录
  const { user } = useUser();
  // 修改
  const { mutate: createChat } = useMutation({
    mutationFn: async () => {
      return axios.post("api/create-chat", {
        title: input,
        model: model,
      });
    },
    onSuccess: (res) => {
      // 错误处理和刷新
      router.push(`/chat/${res.data.id}`);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const handleSubmit = () => {
    if (input.trim() === "") {
      return;
    }
    if (!user) {
      router.push("/sign-in");
      return;
    }

    createChat();
  };

  return (
    <div
      className=" antialiased 
        flex flex-row"
    >
      <Navibar />

      <div className="w-4/5 h-screen bg-gray-950/80">
        <div className="h-screen flex flex-col justify-between  items-center ">
          <div className="h-1/5"></div>
          <div className="w-2/3">
            <p className="justify-center text-bold text-white text-5xl ">Hi,我是仿DeepSeek！</p>
                      <div className="h-4"></div>
            <p className="justify-center text-bold text-gray-300/50 text-2xl ">你身边的智能助手，可以为你答疑解惑、尽情创作，快来点击以下任一功能体验吧</p>
            <div
              className="flex flex-col items-center  mt-90 mb-10
  h-32 rounded-lg bg-gray-950/10"
            >
              <textarea
                className="w-full rounded-lg p-3 focus:outline-none text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
              <div className="flex flex-row items-center justify-between w-full h-12 mb-2">
                <div
                  className={`flex flex-row items-center justify-center rounded-lg border-[1px]
            px-2 py-1 ml-2 cursor-pointer 
            ${
              model === "deepseek-r1"
                ? "border-gray-300 bg-gray-700"
                : "border-gray-300"
            }`}
                  onClick={handleChangeModel}
                >
                  <p className="text-sm text-white">深度思考{model} </p>
                </div>
                <div
                  className="flex items-center justify-center border-2 mr-4 border-black p-1 
          rounded-full text-white"
                  onClick={handleSubmit}
                >
                  <EastIcon></EastIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
