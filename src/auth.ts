import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "@auth/core/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('Login attempt with:', credentials.email);

                // BACKEND_URL이 없으면 NEXT_PUBLIC_API_URL 사용
                const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                console.log('Resolved API URL is:', apiUrl);

                try {
                    const res = await fetch(`${apiUrl}/api/users/login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                        headers: { "Content-Type": "application/json" }
                    });

                    console.log('Fetch response status:', res.status);

                    const data = await res.json();
                    console.log('Fetch response data:', data);

                    if (res.ok && data && data.user) {
                        // Backend 응답: { access_token, user: { id, email, nickname } }
                        return {
                            id: String(data.user.id),
                            email: data.user.email,
                            nickname: data.user.nickname,
                            access_token: data.access_token, // JWT 토큰 포함
                        };
                    }
                    console.log('Login failed: invalid response or data structure');
                    return null;
                } catch (e) {
                    console.error('Fetch to backend login failed:', e);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.nickname = user.nickname;
                token.accessToken = user.access_token; // JWT 토큰 저장
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email as string;
                session.user.nickname = token.nickname as string;
            }
            session.accessToken = token.accessToken as string; // 세션에 JWT 토큰 전달
            return session;
        }
    }
})