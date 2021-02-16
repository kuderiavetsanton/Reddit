import { Schema, Document } from 'mongoose';
import { PostDocument } from './Post';
import { CommentDocument } from './Comment';
interface Vote {
    username: string;
    value: number;
    post?: Schema.Types.ObjectId | Partial<PostDocument>;
    comment?: Schema.Types.ObjectId | Partial<CommentDocument>;
}
export interface VoteDocument extends Vote, Document {
}
declare const _default: import("mongoose").Model<VoteDocument>;
export default _default;
