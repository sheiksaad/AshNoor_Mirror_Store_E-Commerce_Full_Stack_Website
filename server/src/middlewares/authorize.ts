import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import type { JwtPayload } from "../utils/jwt.js";

export function authorize(...allowedRoles: JwtPayload["role"][]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission to perform this action");
        }
        next();
    };
}