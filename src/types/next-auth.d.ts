import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            nickname: string;
        } & DefaultSession["user"];
        accessToken?: string; // Backend JWT 토큰
    }
    interface User {
        id: string;
        nickname: string;
        access_token?: string; // Backend 로그인 응답의 JWT 토큰
    }
}

declare module "@auth/core/jwt" { // 이게 뭐냐하면 . next-auth의 기본 타입에 우리가 원하는 값을 추가하는거야.
    interface JWT {
        accessToken?: string;
        nickname?: string;
    }
}