import {UserLoginRequest} from "@/model/User";
import axiosInstance from "@/_lib/axios";

export async function login(data: UserLoginRequest){

    const response = await axiosInstance.post("/users/login",data);
    return response.data;
}