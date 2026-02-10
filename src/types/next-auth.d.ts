import { DefaultSession } from "next-auth";

declare module "next-auth" { // next-auth 타입 확장 ,delcare이란 ? 타입 선언을 확장하기 위해 사용
    interface Session {
        user: {
            id: string;
            nickname: string;
        } & DefaultSession["user"]; // DefaultSession은 next-auth에서 정의된 기본 세션 인터페이스
    }
    interface User {
        id: string;
        nickname: string;
    }
}