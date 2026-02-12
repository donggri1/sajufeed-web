import {UserJoinRequest} from "@/model/User";
import axiosInstance from "@/_lib/axios";

export async function signup(data : UserJoinRequest){
    // Axios는 JSON 변환을 자동으로 해주며, 400/500 에러 시 자동으로 throw
    const response = await axiosInstance.post<boolean>("/users/join",data);
    return response.data;
}