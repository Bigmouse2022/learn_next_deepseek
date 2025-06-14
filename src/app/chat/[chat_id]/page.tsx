"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import EastIcon from "@mui/icons-material/East";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Markdown from "react-markdown";
import Navibar from "@/app/compoents/Navibar";
export default function Page() {
  //拿到chat_id
  const { chat_id } = useParams();
  //从数据库里取它存的数据
  const { data: chat } = useQuery({
    queryKey: ["chat", chat_id],
    queryFn: () => {
      return axios.post(`/api/get-chat`, {
        chat_id: chat_id,
      });
    },
  });

  //每次刷新要读取之前的数据
  const { data: previousMessages } = useQuery({
    queryKey: ["message", chat_id],
    queryFn: () => {
      return axios.post(`/api/get-messages`, {
        chat_id: chat_id,
        chat_user_id: chat?.data?.userId,
      });
    },
    enabled: !!chat?.data?.id,
  });

  const [model, setModel] = useState("deepseek-v3");
  const handleChangeModel = () => {
    setModel(model === "deepseek-v3" ? "deepseek-r1" : "deepseek-v3");
  };
  //信息，输入框内容，输入框改变函数，提交函数
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: {
      model: model,
      chat_id: chat_id,
      chat_user_id: chat?.data?.useId,
    },
    initialMessages: previousMessages?.data,
  });

  //信息滑动
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endRef.current) {
      endRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //自动回复新会话
  const handleFirstMessage = async () => {
    if (chat?.data?.title && previousMessages?.data?.length === 0) {
      await append({
        role: "user",
        content: chat?.data?.title,
      });
      // ,
      //   {
      //     model: model,
      //     chat_id: chat_id,
      //     chat_user_id: chat?.data?.useId,
      //   }
    }
  };
  useEffect(() => {
    setModel(chat?.data?.model);
    handleFirstMessage();
  }, [chat?.data?.title, previousMessages]);

  return (
    <div
      className=" antialiased 
        flex flex-row"
    >
      <Navibar />

      <div className="w-4/5 h-screen bg-gray-950/80">
        <div className="flex flex-col h-screen justify-between items-center">
          <div
            className="flex flex-col w-2/3 gap-8 overflow-y-auto
         justify-between flex-1 no-scrollbar"
          >
            <div className="h-4"></div>
            <div className="flex flex-col gap-8 flex-1 ">
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
                  <div
                    className={`block p-2 rounded-lg text-white ${
                      message?.role === "assistant" ? "" : "bg-gray-700/90"
                    }`}
                  >
                    <Markdown>{message?.content}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-4" ref={endRef}></div>
          {/*输入框*/}
          <div className="h-40 flex flex-col items-center justify-center mt-4 h-32 rounded-2xl w-2/3 mb-10 bg-gray-950/10 text-white">
            <textarea
              className="h-35 w-full rounded-2xl p-3 focus:outline-none no-scrollbar" // 增大圆角
              value={input}
              onChange={handleInputChange}
            ></textarea>
            <div className="flex flex-row items-center justify-between w-full h-20 ">
              <div
                className={`flex flex-row items-center justify-center rounded-full border-[1px]  
        px-4 py-1 cursor-pointer  ml-4
        ${
          model === "deepseek-r1"
            ? "border-gray-300 bg-gray-700"
            : "border-gray-300"
        }`}
                onClick={handleChangeModel}
              >
                <p className="text-sm text-white">深度思考{model}</p>
              </div>
              <div
                className="flex items-center justify-center border-2  border-white p-1 h-7 w-7 mr-5
        rounded-full text-white"
                onClick={handleSubmit}
              >
                <EastIcon></EastIcon>
              </div>
            </div>
          </div>
          {/* <div
            className="flex flex-col items-center justify-center mt-4 
 h-32 rounded-lg w-2/3 mb-10 bg-gray-950/10 text-white" //rounded-2xl
          >
            <textarea
              className="w-full rounded-lg p-3 focus:outline-none" //rounded-2xl
              value={input}
              onChange={handleInputChange}
            ></textarea>
            <div className="flex flex-row items-center justify-between w-full h-12 mb-2"> 
              <div
                className={`flex flex-row items-center justify-center rounded-lg border-[1px] //rounded-full 
            px-2 py-1 ml-2 cursor-pointer  // px-4
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
          rounded-full text-white "
                onClick={handleSubmit}
              >
                <EastIcon></EastIcon>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
