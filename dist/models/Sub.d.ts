import { Schema, Document } from 'mongoose';
import { PostDocument } from './Post';
import { UserDocument } from './User';
interface Sub {
    name: string;
    author: Schema.Types.ObjectId | Partial<UserDocument>;
    title: string;
    description?: string;
    posts: Schema.Types.ObjectId[] | Partial<PostDocument>[];
    imageUrn?: string;
    bannerUrn?: string;
    imageUrl?: string;
    bannerUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface SubDocument extends Sub, Document {
}
declare const _default: import("mongoose").Model<SubDocument>;
export default _default;
