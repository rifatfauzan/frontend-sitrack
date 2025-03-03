import { CommonResponseInterface } from '@/interfaces/common.interfaces';

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface UserRequestInterface {
    username: string;
    password: string;
    role: string;
}

export type UserResponse = CommonResponseInterface<User>;
export type UsersResponse = CommonResponseInterface<User[]>;