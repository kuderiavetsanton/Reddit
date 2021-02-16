import { NextFunction, Request, Response } from "express";
export declare const createPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const fetchComments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createComment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
