export interface LoginRequest {
    username: string,
    password: string,
}

export interface LoginResponse {
    token: string,
}

export interface AuthUser {
    username: string,
    role: string,
}