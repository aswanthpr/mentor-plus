export declare class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare const createHttpError: (statusCode: number, message: string) => HttpError;
//# sourceMappingURL=http-error-handler.util.d.ts.map