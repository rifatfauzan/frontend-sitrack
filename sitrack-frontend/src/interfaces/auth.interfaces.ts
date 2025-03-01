export interface LoginRequest {
    username: string,
    password: string,
}

export interface LoginResponse {
    status: number;
    message: string;
    timestamp: string;
    data: {
      token: string;
    };
    dataList: null;
}

export interface AuthUser {
    username: string,
    role: string,
}