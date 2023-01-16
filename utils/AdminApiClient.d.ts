export declare class AdminApiClient {
    private readonly logger;
    private static instance;
    private token;
    private requestTimeoutMs;
    private constructor();
    static getInstance(): AdminApiClient;
    private login;
    private refreshToken;
    hasToken(): Promise<boolean>;
    get(uri: string, params?: any): Promise<import("axios").AxiosResponse<any, any>>;
    post(uri: string, data?: any): Promise<import("axios").AxiosResponse<any, any>>;
    delete(uri: string, params?: any): Promise<import("axios").AxiosResponse<any, any>>;
}
