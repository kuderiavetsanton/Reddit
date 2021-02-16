import { Schema, Document, Model } from 'mongoose';
import { PostDocument } from './Post';
import { SubDocument } from './Sub';
interface User {
    username: string;
    email: string;
    password: string;
    posts: Schema.Types.ObjectId[] | Partial<PostDocument>[];
    subs: Schema.Types.ObjectId[] | Partial<SubDocument>[];
}
export interface UserDocument extends User, Document {
}
export interface UserModel extends Model<UserDocument> {
}
declare const _default: UserModel;
export default _default;
