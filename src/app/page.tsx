"use client";
import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
import axios from 'axios'
import {  useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default function Home() {
  const [input, setInput] = useState(""); //输入框
  const [model, setModel] = useState("deepseek-v3");
    const handleChangeModel = ()=>{
    setModel(model==='deepseek-v3'?'deepseek-r1':'deepseek-v3')
  }
//创建消息的方法
// 创建一个 client
const queryClient = useQueryClient();
const router = useRouter()

//用户是否完成登录
const {user} = useUser()
    // 修改
  const {mutate:createChat} = useMutation({
    mutationFn: async()=>{
      return axios.post('api/create-chat',{
        title:input,
        model:model,
      })
    },
    onSuccess: (res) => {
      // 错误处理和刷新
      router.push(`/chat/${res.data.id}`)
      queryClient.invalidateQueries({queryKey:['chats']});
    },
  });

  const handleSubmit = ()=>{
    if(input.trim()===''){
      return
    }
    if(!user){
      router.push("/sign-in")
      return
    }

    createChat()

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
    </div>
  );
}
