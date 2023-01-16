import { AuthUser, IAuthor } from "./IAuthor";
export declare class AuthLocal implements IAuthor {
    private readonly secret;
    private readonly logger;
    constructor(secret: string);
    verifyToken(token: string): Promise<AuthUser>;
}
