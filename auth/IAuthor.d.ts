export type AuthUser = {
    userId: number;
    username: string;
    iat: number;
    exp: number;
};
export interface IAuthor {
    verifyToken(token: string): Promise<AuthUser>;
}
