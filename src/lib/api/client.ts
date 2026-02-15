import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
});

// 요청 인터셉터 - JWT 토큰 자동 첨부
apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        console.log("Request Sent:", config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답데이터 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("인증이 만료되었습니다.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
