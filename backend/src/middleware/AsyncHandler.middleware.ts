import { NextFunction, Request, Response } from "express"

type AsyncHandlerType = (
    req : Request,
    res : Response,
    next : NextFunction
) => Promise<void>

export const AsyncHandler = (handler: AsyncHandlerType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error); 
        }
    };
};

