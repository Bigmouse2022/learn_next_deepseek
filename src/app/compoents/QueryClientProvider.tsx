'use client'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";


// 创建一个 client
const queryClient = new QueryClient();

function App({children}:{children:React.ReactNode}) {
  return (
    // 提供 client 至 App
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
export default App