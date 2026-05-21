export interface AuthUser {
    id: number; 
    email: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
}