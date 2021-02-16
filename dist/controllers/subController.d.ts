import { Request, Response } from "express";
export declare const createSub: (req: Request, res: Response) => Promise<void>;
export declare const fetchSub: (req: Request, res: Response) => Promise<void>;
export declare const fetchSubPosts: (req: Request, res: Response) => Promise<void>;
export declare const searchSub: (req: Request, res: Response) => Promise<void>;
export declare const uploadSubImage: (req: Request, res: Response) => Promise<void>;
