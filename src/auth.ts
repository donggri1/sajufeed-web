import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";

export const {handlers,auth,signIn,signOut} = NextAuth({
    providers: [Kakao({
        clientId : process.env.AUTH_KAKAO_ID as string,
        clientSecret : process.env.AUTH_KAKAO_SECRET as string
    })],
})