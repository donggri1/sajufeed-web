"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export default function RQProvider({children} : {children : React.ReactNode}){
    const [client] = useState( // 무슨뜻 이냐하면 리액트 훅인 useState를 사용해서 쿼리 클라이언트를 상태로 관리하는 것임
        new QueryClient({
            defaultOptions: {// // 무슨뜻 이냐하면 쿼리의 기본 옵션을 설정하는 곳임
                queries : {
                    refetchOnWindowFocus : false,
                    // 무슨뜻 이냐하면 사용자가 다른 탭 갔다가 다시 돌아왔을때 데이터를 다시 불러올지 말지 정하는 옵션임
                    retry : false
                    //// 무슨뜻 이냐하면  쿼리가 실패했을때 재시도 할지 말지 정하는 옵션임
                }
            }
        })
    )

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV === "development"} />
        </QueryClientProvider>
    )
}

