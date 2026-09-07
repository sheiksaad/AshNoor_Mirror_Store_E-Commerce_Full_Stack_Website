import type { Response } from "express";

interface ApiResponseShape<T> {
    success: true;
    message: string;
    data: T;
}

export function sendResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T,
): Response<ApiResponseShape<T>> {
    return res.status(statusCode).json({ success: true, message, data });
}