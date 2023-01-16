export interface Logger {
    trace(message?: any, ...params: any[]): void;
    debug(message?: any, ...params: any[]): void;
    info(message?: any, ...params: any[]): void;
    warn(message?: any, ...params: any[]): void;
    error(message?: any, ...params: any[]): void;
}
export declare function getLogger(module?: string): Logger;
