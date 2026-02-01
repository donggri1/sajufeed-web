import axios from 'axios';

const axiosInstance = axios.create({
    baseURL : "/api", // next.config에서 설정해줬음
    timeout : 5000, // 5초 타임아웃
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true // 쿠키 전달 허용
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config)=>{
        // 요청 전에 수행할 작업 (예: 인증 토큰 추가)
        console.log("Request Sent : " , config.url);
        return config;
    },
    (error)=> Promise.reject(error)
);

// 응답데이터 인터셉터
axiosInstance.interceptors.response.use(
    (response)=>response, // 응답 데이터 그대로 반환
    (error)=>{
        if (error.response?.status === 401) {
            // 인증 에러 처리 로직
            console.error("인증이 만료되었습니다.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
