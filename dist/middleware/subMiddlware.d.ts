import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
export declare const upload: multer.Multer;
export declare const ownSub: (req: Request, res: Response, next: NextFunction) => Promise<Response<any> | undefined>;
