export interface UserJoinRequest{
    email : string;
    nickname :string;
    password : string;
}

export  type UserJoinResponse = boolean;

export interface UserLoginRequest{
    email : string;
    password : string;
}

export interface User{
    id: string;
    email :string;
    nickname : string;
    image?: string;
}